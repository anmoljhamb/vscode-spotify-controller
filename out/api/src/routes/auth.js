"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const services_1 = require("../services");
exports.authRouter = express_1.default.Router();
exports.authRouter.get("/", async (req, res, next) => {
    try {
        console.log(services_1.spotifyApi.getAccessToken());
        const currentUser = await services_1.spotifyApi.getMe();
        return res.status(200).json({
            message: "Working",
            status: currentUser.body,
        });
    }
    catch (e) {
        next(e);
    }
});
exports.authRouter.get("/login", (req, res, next) => {
    const scopes = [
        "user-read-private",
        "user-read-email",
        "user-read-playback-state",
        "user-read-currently-playing",
        "user-modify-playback-state",
        "app-remote-control",
        "streaming",
    ];
    const authUrl = services_1.spotifyApi.createAuthorizeURL(scopes, "some-state-of-my-choice");
    return res.redirect(authUrl);
});
exports.authRouter.get("/callback", async (req, res, next) => {
    const { code } = req.query;
    try {
        const data = await services_1.spotifyApi.authorizationCodeGrant(code);
        services_1.spotifyApi.setAccessToken(data.body.access_token);
        services_1.spotifyApi.setRefreshToken(data.body.refresh_token);
        return res.status(200).json({
            data,
        });
    }
    catch (e) {
        next(e);
    }
});
//# sourceMappingURL=auth.js.map