import express from "express";

export const authRouter = express.Router();

authRouter.get("/", (req, res, next) => {
    return res.status(200).json({ message: "Working" });
});
