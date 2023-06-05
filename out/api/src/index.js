"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = require("path");
const dotenv_1 = require("dotenv");
const morgan_1 = require("morgan");
const cors_1 = require("cors");
const http_errors_1 = require("http-errors");
const routes_1 = require("./routes");
dotenv_1.default.config({ path: path_1.default.join(__dirname, "..", ".env") });
const PORT = process.env.PORT || 8080;
const main = async () => {
    const app = (0, express_1.default)();
    // 3rd party middlewares.
    app.use((0, morgan_1.default)("dev"));
    app.use((0, cors_1.default)());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.get("/", (req, res) => {
        res.status(200).json({ message: "Working" });
    });
    // Routes
    app.use("/auth", routes_1.authRouter);
    app.use("/status", routes_1.statusRoutes);
    app.use("/control", routes_1.controlRouter);
    app.use((req, res, next) => {
        return next(new http_errors_1.default.NotFound(`The requested '${req.url}' url was not found.`));
    });
    app.use((err, req, res, next) => {
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
    app.listen(PORT, () => {
        console.log(`Listening on the url http://localhost:${PORT}`);
    });
};
main();
//# sourceMappingURL=index.js.map