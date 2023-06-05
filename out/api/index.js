"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importDefault(require("http-errors"));
const routes_1 = require("./routes");
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
// Routes
exports.app.use("/auth", routes_1.authRouter);
exports.app.use("/status", routes_1.statusRoutes);
exports.app.use("/control", routes_1.controlRouter);
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
                    url: "http://localhost:8080/auth/login",
                },
            };
        }
        return res.status(err.statusCode).json({ ...object });
    }
    return res.status(500).json({ err });
});
//# sourceMappingURL=index.js.map