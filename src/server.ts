import * as vscode from "vscode";
import axios from "axios";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import createHttpError from "http-errors";
import { BACKEND_URI } from "./constants";
import {
    clearRefreshInterval,
    setAccessToken,
    setRefreshInterval,
    setRefreshToken,
    spotifyApi,
} from "./utils";
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

app.get("/auth/callback", async (req, res, next) => {
    const { code } = req.query;
    try {
        const resp = await axios.get(
            `${BACKEND_URI}/auth/grant?code=${code as string}`
        );
        const { access_token, refresh_token } = resp.data;
        await setAccessToken(access_token);
        await setRefreshToken(refresh_token);
        /**
         * todo set the refresh interval
         */
        return res.send(
            "You were authenticated successfully! You can close this window now."
        );
    } catch (e) {
        next(e);
    }
});

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
