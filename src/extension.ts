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

    registerSpotifyCommand("prevSong", "The song was skipped to previous.");
    registerSpotifyCommand("nextSong", "The song was skipped to next.");

    registerCommand("playPause", true, async () => {
        try {
            const isPlaying = await getPlayingStatus();
            let message: string;
            let resp: Response<void>;
            if (isPlaying) {
                resp = await spotifyApi.pause();
                message = "The song was paused";
            } else {
                resp = await spotifyApi.play();
                message = "The song was resumed";
            }
            vscode.window.showInformationMessage(message);
        } catch (e) {
            if (e instanceof Error) {
                vscode.window.showErrorMessage(e.message);
            }
        }
    });

    registerCommand("helloWorld", false, () => {
        vscode.window.showInformationMessage(
            "Hello World from the spotify controller extension."
        );
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

    function registerSpotifyCommand(commandId: string, sucessMsg: string) {
        registerCommand(commandId, true, async () => {
            try {
                await handleCommand(commandId);
                vscode.window.showInformationMessage(sucessMsg);
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
        }
    }
}

export function deactivate() {
    server.close(() => {
        console.log(`Stopped listening on the url *:${PORT}`);
    });
}
