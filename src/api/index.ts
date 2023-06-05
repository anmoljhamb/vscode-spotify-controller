import express, { NextFunction, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import createHttpError from "http-errors";
import { authRouter, controlRouter, statusRoutes } from "./routes";
import { protectedRoute } from "./middlewares";
import { BACKEND_URI } from "../constants";
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export const app = express();

// 3rd party middlewares.
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Working" });
});

// Routes
app.use("/auth", authRouter);
app.use("/status", statusRoutes);
app.use("/control", controlRouter);

app.use((req, res, next) => {
    return next(
        new createHttpError.NotFound(
            `The requested '${req.url}' url was not found.`
        )
    );
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof createHttpError.HttpError) {
        let object: any = { message: err.message };
        if (err.statusCode === 401) {
            object = {
                ...object,
                actions: {
                    message: "Please Login To set the token",
                    url: `${BACKEND_URI}/auth/login`,
                },
            };
        }
        return res.status(err.statusCode).json({ ...object });
    }
    return res.status(500).json({ err });
});
