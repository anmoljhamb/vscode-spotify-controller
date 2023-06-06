"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
dotenv_1.default.config({ path: path_1.default.join(__dirname, "..", ".env") });
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
        await (0, utils_1.setAccessToken)(access_token);
        await (0, utils_1.setRefreshToken)(refresh_token);
        /**
         * todo set the refresh interval
         */
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