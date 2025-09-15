const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.get("/github/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send("Code not provided");

    try {
        const tokenResponse = await axios.post(
            `https://github.com/login/oauth/access_token`,
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: "application/json" } }
        );

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get(`https://api.github.com/user`, {
            headers: { Authorization: `token ${accessToken}` },
        });

        const { id: githubId, login: username, email } = userResponse.data;

        let user = await User.findOne({ githubId });
        if (!user) {
            user = await User.create({ githubId, username, email });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;
