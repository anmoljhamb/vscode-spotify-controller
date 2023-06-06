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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRefreshInterval = exports.setRefreshInterval = exports.refreshInterval = exports.intervalTime = exports.refreshToken = exports.protectedCommand = exports.updateIsLoggedIn = exports.isLoggedIn = void 0;
const axios_1 = __importDefault(require("axios"));
const vscode = __importStar(require("vscode"));
const constants_1 = require("../constants");
const tokenManager_1 = require("./tokenManager");
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
    let _refreshToken = (await (0, tokenManager_1.getRefreshToken)());
    try {
        const resp = await axios_1.default.post(`${constants_1.BACKEND_URI}/auth/refreshToken`, {
            refreshToken: _refreshToken,
        });
        await (0, tokenManager_1.setAccessToken)(resp.data.access_token);
        if (resp.data.refresh_token)
            await (0, tokenManager_1.setRefreshToken)(resp.data.refresh_token);
        console.log("Access Token refreshed successfully!");
    }
    catch (e) {
        console.log("error while refreshing");
        console.log(e);
    }
};
exports.refreshToken = refreshToken;
exports.intervalTime = (3600 - 60) * 1000;
const setRefreshInterval = () => {
    exports.refreshInterval = setInterval(exports.refreshToken, exports.intervalTime);
};
exports.setRefreshInterval = setRefreshInterval;
const clearRefreshInterval = () => {
    if (exports.refreshInterval)
        clearInterval(exports.refreshInterval);
};
exports.clearRefreshInterval = clearRefreshInterval;
//# sourceMappingURL=auth.js.map