import express, { NextFunction, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import createHttpError from "http-errors";
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const PORT = process.env.PORT || 8080;

const main = async () => {
    const app = express();

    // 3rd party middlewares.
    app.use(morgan("dev"));
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.get("/", (req, res) => {
        res.status(200).json({ message: "Working" });
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
            return res.status(err.statusCode).json({ message: err.message });
        }
        return res.status(500).json({ err });
    });

    app.listen(PORT, () => {
        console.log(`Listening on the url http://localhost:${PORT}`);
    });
};

main();
