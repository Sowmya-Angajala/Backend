
import rateLimit from "express-rate-limit";

const limitedRateLimiter = rateLimit({
  windowMs: 60 * 1000,          // 1 minute
  max: 5,                       // limit each client to 5 requests
  standardHeaders: "draft-7",   // include RateLimit-* headers
  legacyHeaders: false,         // disable X-RateLimit-* headers
  message: { error: "Too many requests, please try again later." },
});

export default limitedRateLimiter;
