"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusRoutes = void 0;
const express_1 = require("express");
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
exports.statusRoutes = express_1.default.Router();
exports.statusRoutes.use(middlewares_1.protectedRoute);
exports.statusRoutes.get("/", async (req, res, next) => {
    const currentUser = await services_1.spotifyApi.getMe();
    return res.status(200).json({ message: "Working" });
});
exports.statusRoutes.get("/currentTrack", async (req, res, next) => {
    try {
        const resp = await services_1.spotifyApi.getMyCurrentPlayingTrack();
        return res.status(200).json({ message: "working", resp });
    }
    catch (e) {
        return next(e);
    }
});
//# sourceMappingURL=status.js.map