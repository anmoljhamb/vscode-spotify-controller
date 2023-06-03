import express from "express";
import { spotifyApi } from "../services";
import { protectedRoute } from "../middlewares";

export const statusRoutes = express.Router();

statusRoutes.use(protectedRoute);

statusRoutes.get("/", async (req, res, next) => {
    const currentUser = await spotifyApi.getMe();
    return res.status(200).json({ message: "Working" });
});

statusRoutes.get("/currentTrack", (req, res, next) => {});
