import express, { NextFunction, Request, Response } from "express";
import { spotifyApi } from "../services";
import createHttpError from "http-errors";

export const protectedRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await spotifyApi.getMe();
        next();
    } catch (e: any) {
        next(new createHttpError.Unauthorized("Not Logged In"));
    }
};
