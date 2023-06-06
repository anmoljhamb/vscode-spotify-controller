"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResp = exports.getPlayingStatus = exports.authUrl = exports.spotifyApi = void 0;
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const constants_1 = require("../constants");
exports.spotifyApi = new spotify_web_api_node_1.default({
    clientId: constants_1.CLIENT_ID,
    redirectUri: constants_1.REDIRECT_URI,
});
const scopes = [
    "playlist-read-private",
    "user-read-private",
    "user-read-email",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-modify-playback-state",
    "app-remote-control",
    "streaming",
];
exports.authUrl = exports.spotifyApi.createAuthorizeURL(scopes, "some-state-of-my-choice");
const getPlayingStatus = async () => {
    const resp = await exports.spotifyApi.getMyCurrentPlaybackState();
    (0, exports.handleResp)(resp);
    return resp.body.is_playing;
};
exports.getPlayingStatus = getPlayingStatus;
const handleResp = (resp) => {
    if (resp.statusCode === 204)
        throw new Error("No Spotify Instance Found");
};
exports.handleResp = handleResp;
//# sourceMappingURL=spotify.js.map