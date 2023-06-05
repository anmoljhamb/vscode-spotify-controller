import * as vscode from "vscode";
import {
    BACKEND_URI,
    CLIENT_ID,
    CLIENT_SECRET,
    PORT,
    appId,
    commands,
} from "./constants";
import {
    getAccessToken,
    getPlayingStatus,
    getRefreshToken,
    handleError,
    handleResp,
    isLoggedIn,
    protectedCommand,
    refreshToken,
    setAccessToken,
    setRefreshInterval,
    setRefreshToken,
    spotifyApi,
    updateGlobalState,
    updateIsLoggedIn,
} from "./utils";
import { app } from "./server";

const server = app.listen(PORT, () => {
    console.log(`Listening on the url *:${PORT}`);
});

export async function activate(context: vscode.ExtensionContext) {
    updateGlobalState(context.globalState);

    await refreshToken();

    spotifyApi.setAccessToken((await getAccessToken()) as string);
    spotifyApi.setRefreshToken((await getRefreshToken()) as string);

    try {
        const user = await spotifyApi.getMe();
        updateIsLoggedIn(true);
        setRefreshInterval();
    } catch (e) {
        vscode.window.showWarningMessage(
            "Spotify Controller Not Logged In. Please Login"
        );
        updateIsLoggedIn(false);
    }

    commands.forEach((command) => registerSpotifyCommand(command));

    registerCommand("login", false, () => {
        vscode.window.showInformationMessage(
            "Opening the login url. Please Authenticate."
        );
        vscode.env.openExternal(vscode.Uri.parse(`${BACKEND_URI}/auth/login`));
    });

    registerCommand("logout", false, async () => {
        await setAccessToken("");
        await setRefreshToken("");
        spotifyApi.setAccessToken("");
        spotifyApi.setRefreshToken("");
        vscode.window.showInformationMessage(
            "Spotify account was successfully logged out"
        );
    });

    registerCommand("setVolume", true, async () => {
        const resp = await vscode.window.showInputBox({
            title: "Set Volume",
            validateInput(value) {
                try {
                    const temp = Number.parseInt(value);
                    if (temp < 0 || temp > 100)
                        throw new Error("Invalid Choice");
                } catch (e) {
                    return "The value needs to be in the range [0, 100].";
                }
            },
        });
        if (!resp || resp.length === 0) return;
        try {
            await handleCommand({
                handlerId: "setVolume",
                payload: resp,
            });
        } catch (e) {
            handleError(e);
        }
    });

    registerCommand("playPause", true, async () => {
        try {
            const isPlaying = await getPlayingStatus();
            vscode.commands.executeCommand(
                `${appId}.${isPlaying ? "pause" : "play"}`
            );
        } catch (e) {
            handleError(e);
        }
    });

    function registerCommand(
        commandId: string,
        authRequired: boolean,
        func: () => void
    ) {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                `${appId}.${commandId}`,
                authRequired ? protectedCommand(func) : func
            )
        );
    }

    function registerSpotifyCommand({
        commandId,
        successMsg,
        handlerId,
        payload,
    }: RegisterSpotifyCommand) {
        registerCommand(commandId, true, async () => {
            try {
                if (!handlerId) handlerId = commandId;
                await handleCommand({ handlerId, payload });
                vscode.window.showInformationMessage(successMsg);
            } catch (e) {
                handleError(e);
            }
        });
    }

    async function handleCommand({
        handlerId,
        payload,
    }: {
        handlerId: string;
        payload?: any;
    }) {
        switch (handlerId) {
            case "nextSong":
                return await spotifyApi.skipToNext();
            case "prevSong":
                return await spotifyApi.skipToPrevious();
            case "pause":
                return await spotifyApi.pause();
            case "play":
                return await spotifyApi.play();
            case "shuffle":
                return await spotifyApi.setShuffle(payload);
            case "repeat":
                return await spotifyApi.setRepeat(payload);
            case "setVolume":
                return await spotifyApi.setVolume(payload);
            default:
                vscode.window.showWarningMessage(
                    "The given command was not found."
                );
                return;
        }
    }
}

export function deactivate() {
    server.close(() => {
        console.log(`Stopped listening on the url *:${PORT}`);
    });
}
