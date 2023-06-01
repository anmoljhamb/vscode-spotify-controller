import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "../constants";
import { spotifyApi } from "../services";

export const authRouter = express.Router();

authRouter.get("/", async (req, res, next) => {
    await spotifyApi.pause();
    return res.status(200).json({ message: "Working" });
});

authRouter.get("/login", (req, res, next) => {
    const scopes = ["user-read-private", "user-read-email"];

    const authUrl = spotifyApi.createAuthorizeURL(
        scopes,
        "some-state-of-my-choice"
    );

    return res.redirect(authUrl);
});

authRouter.get("/callback", async (req, res, next) => {
    const { code } = req.query;
    try {
        const data = await spotifyApi.authorizationCodeGrant(code as string);

        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);

        return res.status(200).json({
            data,
        });
    } catch (e) {
        next(e);
    }
});
