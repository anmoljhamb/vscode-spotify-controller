import express from "express";
import { spotifyApi } from "../services";
import { setAuthToken, setRefreshToken } from "../../utils";

export const authRouter = express.Router();

authRouter.get("/", async (req, res, next) => {
    try {
        console.log(spotifyApi.getAccessToken());
        const currentUser = await spotifyApi.getMe();

        return res.status(200).json({
            message: "Working",
            status: currentUser.body,
        });
    } catch (e) {
        next(e);
    }
});

authRouter.get("/login", (req, res, next) => {
    const scopes = [
        "user-read-private",
        "user-read-email",
        "user-read-playback-state",
        "user-read-currently-playing",
        "user-modify-playback-state",
        "app-remote-control",
        "streaming",
    ];

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

        await setAuthToken(data.body.access_token);
        await setRefreshToken(data.body.refresh_token);

        return res.send(
            "You were authenticated successfully! You can close this window now."
        );
    } catch (e) {
        next(e);
    }
});
