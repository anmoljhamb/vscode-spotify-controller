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
exports.app = void 0;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const morgan_1 = __importDefault(require("morgan"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
exports.app = (0, express_1.default)();
// 3rd party middlewares.
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use(express_1.default.json());
exports.app.get("/", (req, res) => {
    res.status(200).json({ message: "Working" });
});
exports.app.get("/auth/callback", async (req, res, next) => {
    const { code } = req.query;
    try {
        const resp = await axios_1.default.get(`${constants_1.BACKEND_URI}/auth/grant?code=${code}`);
        const { access_token, refresh_token } = resp.data;
        utils_1.spotifyApi.setAccessToken(access_token);
        await (0, utils_1.setAccessToken)(access_token);
        await (0, utils_1.setRefreshToken)(refresh_token);
        (0, utils_1.setRefreshInterval)();
        (0, utils_1.updateIsLoggedIn)(true);
        vscode.window.showInformationMessage("The user was logged in successfully!");
        return res.send("You were authenticated successfully! You can close this window now.");
    }
    catch (e) {
        next(e);
    }
});
exports.app.use((req, res, next) => {
    return next(new http_errors_1.default.NotFound(`The requested '${req.url}' url was not found.`));
});
exports.app.use((err, req, res, next) => {
    if (err instanceof http_errors_1.default.HttpError) {
        let object = { message: err.message };
        if (err.statusCode === 401) {
            object = {
                ...object,
                actions: {
                    message: "Please Login To set the token",
                    url: `${constants_1.BACKEND_URI}/auth/login`,
                },
            };
        }
        return res.status(err.statusCode).json({ ...object });
    }
    return res.status(500).json({ err });
});
//# sourceMappingURL=server.js.map