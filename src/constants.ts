import * as vscode from "vscode";

export const appId = "spotify-controller";
export const PORT: number = vscode.workspace
    .getConfiguration()
    .get("spotifyControllerApiPort") as number;
export const BACKEND_URI = `http://localhost:8080`;
export const CLIENT_ID = "1ecb3b66444c48918e9a3c282a18ab01";
export const SHOW_ALERTS: boolean = vscode.workspace
    .getConfiguration()
    .get("spotifyControllerShowInformationAlerts") as boolean;
export const REDIRECT_URI = `http://localhost:${PORT}/auth/callback`;

export const commands: RegisterSpotifyCommand[] = [
    {
        commandId: "nextSong",
        successMsg: "The song was skipped to next successfully!",
    },
    {
        commandId: "prevSong",
        successMsg: "The song was skipped to previous successfully!",
    },
    {
        commandId: "pause",
        successMsg: "The song was paused successfully.",
    },
    {
        commandId: "play",
        successMsg: "The song was resumed successfully.",
    },
    {
        commandId: "shuffleOff",
        successMsg: "The shuffle was turned off successfully!",
        handlerId: "shuffle",
        payload: false,
    },
    {
        commandId: "shuffleOn",
        successMsg: "The shuffle was turned on successfully!",
        handlerId: "shuffle",
        payload: true,
    },
    {
        commandId: "setRepeatContext",
        successMsg: "The repeat was set to the current context",
        handlerId: "repeat",
        payload: "context",
    },
    {
        commandId: "setRepeatTrack",
        successMsg: "The repeat was set to the current track",
        handlerId: "repeat",
        payload: "track",
    },
    {
        commandId: "setRepeatOff",
        successMsg: "The repeat was turned off",
        handlerId: "repeat",
        payload: "off",
    },
];
