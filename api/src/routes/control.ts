import express from "express";
import { protectedRoute } from "../middlewares";
import { spotifyApi } from "../services";

export const controlRouter = express.Router();

controlRouter.use(protectedRoute);

controlRouter.get("/play_pause", async (req, res, next) => {
    const resp = await spotifyApi.getMyCurrentPlaybackState();
    if (resp.statusCode === 204) {
        return res.status(200).json({ message: "No active sessions found." });
    }
    let message: string;
    if (resp.body.is_playing) {
        await spotifyApi.pause();
        message = "Spotify was paused successfully!";
    } else {
        await spotifyApi.play();
        message = "Spotify was resumed successfully!";
    }
    return res.status(200).json({ message });
});
