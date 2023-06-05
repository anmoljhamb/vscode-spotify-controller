import * as vscode from "vscode";

export const appId = "spotify-controller";
export const PORT: number = vscode.workspace
    .getConfiguration()
    .get("spotifyControllerApiPort") as number;
export const BACKEND_URI = `http://localhost:${PORT}`;
