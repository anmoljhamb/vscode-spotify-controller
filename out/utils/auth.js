"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.intervalTime = exports.refreshToken = exports.protectedCommand = exports.updateIsLoggedIn = exports.isLoggedIn = void 0;
const vscode = __importStar(require("vscode"));
const tokenManager_1 = require("./tokenManager");
const spotify_1 = require("./spotify");
exports.isLoggedIn = false;
let updateIsLoggedIn = (status) => (exports.isLoggedIn = status);
exports.updateIsLoggedIn = updateIsLoggedIn;
const protectedCommand = (callback) => {
    if (exports.isLoggedIn)
        return callback;
    return () => {
        vscode.window.showWarningMessage("You are currently not logged in. You need to login.");
    };
};
exports.protectedCommand = protectedCommand;
const refreshToken = async () => {
    console.log("refreshing token");
    spotify_1.spotifyApi.setRefreshToken((await (0, tokenManager_1.getRefreshToken)()));
    try {
        let resp = await spotify_1.spotifyApi.refreshAccessToken();
        await (0, tokenManager_1.setAccessToken)(resp.body.access_token);
        let _refreshToken = resp.body.refresh_token;
        if (_refreshToken)
            await (0, tokenManager_1.setRefreshToken)(_refreshToken);
    }
    catch (e) {
        console.log(e);
        await (0, tokenManager_1.setAccessToken)("");
        await (0, tokenManager_1.setRefreshToken)("");
    }
};
exports.refreshToken = refreshToken;
exports.intervalTime = (3600 - 60) * 1000;
//# sourceMappingURL=auth.js.map