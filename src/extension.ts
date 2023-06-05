import * as vscode from "vscode";
import {
    BACKEND_URI,
    CLIENT_ID,
    CLIENT_SECRET,
    PORT,
    appId,
} from "./constants";
import {
    getAccessToken,
    getPlayingStatus,
    getRefreshToken,
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

    registerSpotifyCommand({
        commandId: "nextSong",
        successMsg: "The song was skipped to next successfully!",
    });
    registerSpotifyCommand({
        commandId: "prevSong",
        successMsg: "The song was skipped to previous successfully!",
    });
    registerSpotifyCommand({
        commandId: "pause",
        successMsg: "The song was paused successfully.",
    });
    registerSpotifyCommand({
        commandId: "play",
        successMsg: "The song was resumed successfully.",
    });
    registerSpotifyCommand({
        commandId: "shuffleOff",
        successMsg: "The shuffle was turned off successfully!",
    });
    registerSpotifyCommand({
        commandId: "shuffleOn",
        successMsg: "The shuffle was turned on successfully!",
    });

    registerCommand("playPause", true, async () => {
        try {
            const isPlaying = await getPlayingStatus();
            vscode.commands.executeCommand(
                `${appId}.${isPlaying ? "pause" : "play"}`
            );
        } catch (e) {
            if (e instanceof Error) {
                vscode.window.showErrorMessage(e.message);
            }
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
    }: {
        commandId: string;
        successMsg: string;
    }) {
        registerCommand(commandId, true, async () => {
            try {
                await handleCommand(commandId);
                vscode.window.showInformationMessage(successMsg);
            } catch (e) {
                if (e instanceof Error)
                    vscode.window.showErrorMessage(e.message);
                console.log(e);
            }
        });
    }

    async function handleCommand(commandId: string) {
        switch (commandId) {
            case "nextSong":
                return await spotifyApi.skipToNext();
            case "prevSong":
                return await spotifyApi.skipToPrevious();
            case "pause":
                return await spotifyApi.pause();
            case "play":
                return await spotifyApi.play();
            case "shuffleOn":
                return await spotifyApi.setShuffle(true);
            case "shuffleOff":
                return await spotifyApi.setShuffle(false);
        }
    }
}

export function deactivate() {
    server.close(() => {
        console.log(`Stopped listening on the url *:${PORT}`);
    });
}
