"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const utils_1 = require("../../utils");
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
        await (0, utils_1.setAuthToken)(data.body.access_token);
        await (0, utils_1.setRefreshToken)(data.body.refresh_token);
        return res.send("You were authenticated successfully! You can close this window now.");
    }
    catch (e) {
        next(e);
    }
});
//# sourceMappingURL=auth.js.map