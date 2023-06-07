"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRefreshInterval = exports.setRefreshInterval = exports.refreshInterval = exports.intervalTime = exports.refreshToken = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
const tokenManager_1 = require("./tokenManager");
const refreshToken = async () => {
    let _refreshToken = (await (0, tokenManager_1.getRefreshToken)());
    try {
        const resp = await axios_1.default.post(`${constants_1.BACKEND_URI}/auth/refreshToken`, {
            refreshToken: _refreshToken,
        });
        await (0, tokenManager_1.setAccessToken)(resp.data.access_token);
        if (resp.data.refresh_token)
            await (0, tokenManager_1.setRefreshToken)(resp.data.refresh_token);
        await (0, tokenManager_1.setLoggedInState)(true);
        console.log("Access Token refreshed successfully!");
    }
    catch (e) {
        console.log("Error while refreshing");
        console.error(e);
    }
};
exports.refreshToken = refreshToken;
exports.intervalTime = (3600 - 60) * 1000;
const setRefreshInterval = () => {
    console.log("setting refresh interval");
    exports.refreshInterval = setInterval(exports.refreshToken, exports.intervalTime);
};
exports.setRefreshInterval = setRefreshInterval;
const clearRefreshInterval = () => {
    console.log("clear refresh interval");
    if (exports.refreshInterval)
        clearInterval(exports.refreshInterval);
};
exports.clearRefreshInterval = clearRefreshInterval;
//# sourceMappingURL=auth.js.map