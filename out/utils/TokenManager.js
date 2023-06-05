"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshToken = exports.setAuthToken = exports.getRefreshToken = exports.getAuthToken = exports.updateGlobalState = void 0;
const constants_1 = require("../constants");
const authTokenKey = `${constants_1.appId}_authTokenId`;
const refreshTokenKey = `${constants_1.appId}_refreshTokenId`;
let globalState;
const updateGlobalState = (_globalState) => (globalState = _globalState);
exports.updateGlobalState = updateGlobalState;
const getAuthToken = () => globalState.get(authTokenKey);
exports.getAuthToken = getAuthToken;
const getRefreshToken = () => globalState.get(refreshTokenKey);
exports.getRefreshToken = getRefreshToken;
const setAuthToken = (token) => globalState.update(authTokenKey, token);
exports.setAuthToken = setAuthToken;
const setRefreshToken = (token) => globalState.update(refreshTokenKey, token);
exports.setRefreshToken = setRefreshToken;
//# sourceMappingURL=TokenManager.js.map