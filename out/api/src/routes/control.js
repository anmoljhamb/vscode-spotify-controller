"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const services_1 = require("../services");
exports.controlRouter = express_1.default.Router();
exports.controlRouter.use(middlewares_1.protectedRoute);
exports.controlRouter.get("/play_pause", async (req, res, next) => {
    const resp = await services_1.spotifyApi.getMyCurrentPlaybackState();
    if (resp.statusCode === 204) {
        return res.status(200).json({ message: "No active sessions found." });
    }
    let message;
    if (resp.body.is_playing) {
        await services_1.spotifyApi.pause();
        message = "Spotify was paused successfully!";
    }
    else {
        await services_1.spotifyApi.play();
        message = "Spotify was resumed successfully!";
    }
    return res.status(200).json({ message });
});
//# sourceMappingURL=control.js.map