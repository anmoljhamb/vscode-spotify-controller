import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { CLIENT_ID, REDIRECT_URI } from "../constants";

export const authRouter = express.Router();

authRouter.get("/", (req, res, next) => {
    return res.status(200).json({ message: "Working" });
});

authRouter.get("/login", (req, res, next) => {
    const scopes = ["user-read-private", "user-read-email"];
    const spotifyApi = new SpotifyWebApi({
        redirectUri: REDIRECT_URI,
        clientId: CLIENT_ID,
    });

    const authUrl = spotifyApi.createAuthorizeURL(
        scopes,
        "some-state-of-my-choice"
    );

    return res.redirect(authUrl);
});

authRouter.get("/callback", (req, res, next) => {
    return res
        .status(200)
        .json({ query: req.query, body: req.body, params: req.params });
});
