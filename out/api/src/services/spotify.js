"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spotifyApi = void 0;
const spotify_web_api_node_1 = require("spotify-web-api-node");
const constants_1 = require("../constants");
exports.spotifyApi = new spotify_web_api_node_1.default({
    clientId: constants_1.CLIENT_ID,
    clientSecret: constants_1.CLIENT_SECRET,
    redirectUri: constants_1.REDIRECT_URI,
});
//# sourceMappingURL=spotify.js.map