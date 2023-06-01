import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const REDIRECT_URI = "http://localhost:8080/auth/callback";
