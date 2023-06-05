import * as vscode from "vscode";

export const appId = "spotify-controller";
export const PORT: number = vscode.workspace
    .getConfiguration()
    .get("spotifyControllerApiPort") as number;
export const BACKEND_URI = `http://localhost:${PORT}`;
export const CLIENT_ID: string = vscode.workspace
    .getConfiguration()
    .get("spotifyControllerClientId") as string;
export const CLIENT_SECRET: string = vscode.workspace
    .getConfiguration()
    .get("spotifyControllerClientSecret") as string;
export const REDIRECT_URI = `${BACKEND_URI}/auth/callback`;
