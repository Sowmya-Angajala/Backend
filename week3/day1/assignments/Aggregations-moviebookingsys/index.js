const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/movie_booking_db";

// --- Schemas & Models ---
const movieSchema = new mongoose.Schema({
  _id: String, // e.g., "M1"
  title: String,
  genre: String,
  releaseYear: Number,
  durationMins: Number,
});
const Movie = mongoose.model("Movie", movieSchema, "movies");

const userSchema = new mongoose.Schema({
  _id: String, // e.g., "U1"
  name: String,
  email: String,
  joinedAt: Date,
});
const User = mongoose.model("User", userSchema, "users");

const bookingSchema = new mongoose.Schema({
  _id: String, // e.g., "B1"
  userId: String,
  movieId: String,
  bookingDate: Date,
  seats: Number,
  status: String, // "Booked", "Cancelled"
});
const Booking = mongoose.model("Booking", bookingSchema, "bookings");

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });



// Create a movie
app.post("/movies", async (req, res) => {
  try {
    const { _id, title, genre, releaseYear, durationMins } = req.body;
    if (!_id || !title) return res.status(400).json({ error: "Missing _id or title" });

    const existing = await Movie.findById(_id);
    if (existing) return res.status(400).json({ error: "Movie with this _id already exists" });

    const movie = new Movie({ _id, title, genre, releaseYear, durationMins });
    await movie.save();
    return res.status(200).json({ message: "Movie created", movie });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Register a user
app.post("/users", async (req, res) => {
  try {
    const { _id, name, email, joinedAt } = req.body;
    if (!_id || !name || !email) return res.status(400).json({ error: "Missing _id, name or email" });

    const existing = await User.findById(_id);
    if (existing) return res.status(400).json({ error: "User with this _id already exists" });

    const user = new User({ _id, name, email, joinedAt: joinedAt ? new Date(joinedAt) : new Date() });
    await user.save();
    return res.status(200).json({ message: "User registered", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create a booking (only if user & movie exist)
app.post("/bookings", async (req, res) => {
  try {
    const { _id, userId, movieId, bookingDate, seats = 1, status = "Booked" } = req.body;
    if (!_id || !userId || !movieId) return res.status(400).json({ error: "Missing _id, userId or movieId" });

    // Validate user & movie exist
    const [user, movie] = await Promise.all([User.findById(userId), Movie.findById(movieId)]);
    if (!user) return res.status(400).json({ error: `User ${userId} not found` });
    if (!movie) return res.status(400).json({ error: `Movie ${movieId} not found` });

    const existing = await Booking.findById(_id);
    if (existing) return res.status(400).json({ error: "Booking with this _id already exists" });

    const booking = new Booking({
      _id,
      userId,
      movieId,
      bookingDate: bookingDate ? new Date(bookingDate) : new Date(),
      seats,
      status,
    });
    await booking.save();
    return res.status(200).json({ message: "Booking created", booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


/**
 * Route 1: /analytics/movie-bookings
 * Get total bookings and total seats booked per movie
 * Response: [{ movieId, title, totalBookings, totalSeats }]
 */
app.get("/analytics/movie-bookings", async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$movieId",
          totalBookings: { $sum: 1 },
          totalSeats: { $sum: "$seats" },
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: { path: "$movie", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          movieId: "$_id",
          title: "$movie.title",
          totalBookings: 1,
          totalSeats: 1,
        },
      },
      { $sort: { totalSeats: -1 } },
    ];

    const result = await Booking.aggregate(pipeline);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Route 2: /analytics/user-bookings
 * Get booking history for each user with movie titles
 * Response: [{ userId, name, bookings: [{ bookingId, movieTitle, seats, bookingDate, status }] }]
 */
app.get("/analytics/user-bookings", async (req, res) => {
  try {
    const pipeline = [
      // Attach user
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      // Attach movie
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      // Group by user
      {
        $group: {
          _id: "$user._id",
          name: { $first: "$user.name" },
          email: { $first: "$user.email" },
          bookings: {
            $push: {
              bookingId: "$_id",
              movieId: "$movie._id",
              movieTitle: "$movie.title",
              seats: "$seats",
              bookingDate: "$bookingDate",
              status: "$status",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: 1,
          email: 1,
          bookings: 1,
        },
      },
      { $sort: { name: 1 } },
    ];

    const result = await Booking.aggregate(pipeline);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Route 3: /analytics/top-users
 * Find users who booked more than 2 times
 * Response: [{ userId, name, totalBookings }]
 */
app.get("/analytics/top-users", async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$userId",
          totalBookings: { $sum: 1 },
        },
      },
      { $match: { totalBookings: { $gt: 2 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          email: "$user.email",
          totalBookings: 1,
        },
      },
      { $sort: { totalBookings: -1 } },
    ];

    const result = await Booking.aggregate(pipeline);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Route 4: /analytics/genre-wise-bookings
 * Total seats booked per genre
 * Response: [{ genre, totalSeats, totalBookings }]
 */
app.get("/analytics/genre-wise-bookings", async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      {
        $group: {
          _id: "$movie.genre",
          totalSeats: { $sum: "$seats" },
          totalBookings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          genre: "$_id",
          totalSeats: 1,
          totalBookings: 1,
        },
      },
      { $sort: { totalSeats: -1 } },
    ];

    const result = await Booking.aggregate(pipeline);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Route 5: /analytics/active-bookings
 * Get all current active ("Booked") bookings with movie and user details
 * Response: [{ bookingId, user: {userId,name,email}, movie: {movieId,title,genre}, seats, bookingDate }]
 */
app.get("/analytics/active-bookings", async (req, res) => {
  try {
    const pipeline = [
      { $match: { status: "Booked" } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      {
        $project: {
          _id: 0,
          bookingId: "$_id",
          seats: 1,
          bookingDate: 1,
          user: {
            userId: "$user._id",
            name: "$user.name",
            email: "$user.email",
            joinedAt: "$user.joinedAt",
          },
          movie: {
            movieId: "$movie._id",
            title: "$movie.title",
            genre: "$movie.genre",
            releaseYear: "$movie.releaseYear",
          },
        },
      },
      { $sort: { bookingDate: -1 } },
    ];

    const result = await Booking.aggregate(pipeline);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 404 fallback
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
