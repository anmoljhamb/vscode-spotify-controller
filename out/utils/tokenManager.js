"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshToken = exports.setAccessToken = exports.getRefreshToken = exports.getAccessToken = exports.updateGlobalState = void 0;
const constants_1 = require("../constants");
const accessTokenKey = `${constants_1.appId}_authTokenId`;
const refreshTokenKey = `${constants_1.appId}_refreshTokenId`;
let globalState;
const updateGlobalState = (_globalState) => (globalState = _globalState);
exports.updateGlobalState = updateGlobalState;
const getAccessToken = () => globalState.get(accessTokenKey);
exports.getAccessToken = getAccessToken;
const getRefreshToken = () => globalState.get(refreshTokenKey);
exports.getRefreshToken = getRefreshToken;
const setAccessToken = (token) => globalState.update(accessTokenKey, token);
exports.setAccessToken = setAccessToken;
const setRefreshToken = (token) => globalState.update(refreshTokenKey, token);
exports.setRefreshToken = setRefreshToken;
//# sourceMappingURL=tokenManager.js.map