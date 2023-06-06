import * as vscode from "vscode";
import axios from "axios";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import morgan from "morgan";
import { BACKEND_URI } from "./constants";
import {
    setAccessToken,
    setRefreshInterval,
    setRefreshToken,
    showInformationMessage,
    spotifyApi,
    updateIsLoggedIn,
} from "./utils";

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
        spotifyApi.setAccessToken(access_token);
        await setAccessToken(access_token);
        await setRefreshToken(refresh_token);
        setRefreshInterval();
        updateIsLoggedIn(true);
        vscode.window.showInformationMessage(
            "The user was logged in successfully!"
        );
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
