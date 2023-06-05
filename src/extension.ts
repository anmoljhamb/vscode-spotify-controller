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
            prompt: "Enter a value between 0-100",
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

    registerCommand("playTrackInContext", true, async () => {
        try {
            const resp = await vscode.window.showInputBox({
                title: "Play Track in context",
                prompt: "Enter the song you want to play.",
            });
            if (!resp) return;
            const tracks = (await spotifyApi.searchTracks(resp)).body.tracks;
            if (tracks === undefined || tracks.items.length === 0)
                throw new Error("No results found");
            const _temp = tracks.items[0];
            const getName = (item: typeof _temp) => {
                const artists = item.artists.map((artist) => artist.name);
                return `${item.name} By ${artists.join(", ")}`;
            };
            const songs = tracks.items.slice(0, 5);
            const choice = await vscode.window.showQuickPick(
                songs.map((song) => getName(song)),
                {
                    title: "Play Track in Context",
                    placeHolder: "Pick which song you'd like to play",
                }
            );
            if (!choice) return;
            const chosenTrack = songs
                .filter((song) => getName(song) === choice)
                .at(0)!;
            await handleCommand({
                handlerId: "playTrackInContext",
                payload: chosenTrack.uri,
            });
        } catch (e) {
            handleError(e);
        }
    });

    registerCommand("seek", true, async () => {
        try {
            const resp = await spotifyApi.getMyCurrentPlayingTrack();
            if (!resp.body.item)
                throw new Error("No currently playing track found");
            const duration_ms = resp.body.item.duration_ms;
            const duration = Math.round(duration_ms / 1000);
            const seekTo = await vscode.window.showInputBox({
                title: "Seek",
                prompt: `Seek to the given second of currently playing track`,
                placeHolder: `Enter a value between 0 and ${duration - 1}`,
                validateInput(value) {
                    try {
                        let temp = Number.parseInt(value);
                        if (temp < 0 || temp > duration) {
                            throw new Error("Not in the range");
                        }
                        return null;
                    } catch (e) {
                        return `The value needs to be in the range [0, ${
                            duration - 1
                        }]`;
                    }
                },
            });
            if (!seekTo) return;
            await handleCommand({
                handlerId: "seek",
                payload: Number.parseInt(seekTo) * 1000,
            });
        } catch (e) {
            handleError(e);
        }
    });

    registerCommand("switchDevice", true, async () => {
        const resp = await spotifyApi.getMyDevices();
        let activeDevice = "";
        const options = resp.body.devices.filter((device) => {
            if (device.is_active) {
                activeDevice = device.name;
            }
            return !device.is_active;
        });
        if (options.length === 0) {
            vscode.window.showWarningMessage(
                "Cannot activate command. There is only one device available"
            );
            return;
        }
        const choice = await vscode.window.showQuickPick(
            options.map((option) => option.name),
            {
                title: "Switch Device",
                placeHolder: `Currently playing on ${activeDevice}`,
            }
        );
        if (!choice) return;
        const device = options.filter((val) => val.name === choice).at(0)!;
        try {
            handleCommand({
                handlerId: "switchDevice",
                payload: [device.id as string],
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
            case "switchDevice":
                return await spotifyApi.transferMyPlayback(payload);
            case "seek":
                return await spotifyApi.seek(payload);
            case "playTrackInContext":
                await spotifyApi.addToQueue(payload);
                return await spotifyApi.skipToNext();
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
