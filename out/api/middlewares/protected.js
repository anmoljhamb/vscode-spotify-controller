"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = void 0;
const services_1 = require("../services");
const http_errors_1 = __importDefault(require("http-errors"));
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