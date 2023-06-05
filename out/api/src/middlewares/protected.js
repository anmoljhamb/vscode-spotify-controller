"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = void 0;
const services_1 = require("../services");
const http_errors_1 = require("http-errors");
const protectedRoute = async (req, res, next) => {
    try {
        await services_1.spotifyApi.getMe();
        next();
    }
    catch (e) {
        next(new http_errors_1.default.Unauthorized("Not Logged In"));
    }
};
exports.protectedRoute = protectedRoute;
//# sourceMappingURL=protected.js.map