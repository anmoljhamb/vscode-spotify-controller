"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayingStatus = exports.spotifyApi = void 0;
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const constants_1 = require("../constants");
exports.spotifyApi = new spotify_web_api_node_1.default({
    clientId: constants_1.CLIENT_ID,
    clientSecret: constants_1.CLIENT_SECRET,
    redirectUri: constants_1.REDIRECT_URI,
});
const getPlayingStatus = async () => {
    const resp = await exports.spotifyApi.getMyCurrentPlaybackState();
    if (resp.statusCode === 204)
        throw new Error("No spotify instance found");
    return resp.body.is_playing;
};
exports.getPlayingStatus = getPlayingStatus;
//# sourceMappingURL=spotify.js.map