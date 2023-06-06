import * as vscode from "vscode";
import { PORT, appId, commands } from "./constants";
import { app } from "./server";
import {
    authUrl,
    getAccessToken,
    getPlayingStatus,
    handleError,
    isLoggedIn,
    protectedCommand,
    refreshToken,
    setAccessToken,
    setRefreshInterval,
    setRefreshToken,
    showInformationMessage,
    spotifyApi,
    updateGlobalState,
    updateIsLoggedIn,
} from "./utils";

const server = app.listen(PORT, () => {
    console.log(`Listening on the url *:${PORT}`);
});

export async function activate(context: vscode.ExtensionContext) {
    updateGlobalState(context.globalState);

    await refreshToken();
    spotifyApi.setAccessToken((await getAccessToken()) as string);

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
        if (isLoggedIn) {
            vscode.window.showWarningMessage(
                "You are already logged in. Please log out to log in again."
            );
            return;
        }
        vscode.window.showInformationMessage(
            "Opening the login url. Please Authenticate."
        );
        vscode.env.openExternal(vscode.Uri.parse(authUrl));
    });

    registerCommand("logout", false, async () => {
        if (!isLoggedIn) {
            vscode.window.showWarningMessage(
                "You aren't logged in right now. Please Login."
            );
        }
        await setAccessToken("");
        await setRefreshToken("");
        updateIsLoggedIn(false);
        spotifyApi.setAccessToken("");
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
            showInformationMessage("Volume set successfully!");
        } catch (e) {
            handleError(e);
        }
    });

    const playTrackTemplate = ({
        title,
        handlerId,
        confirm,
    }: {
        title: string;
        handlerId: string;
        confirm: boolean;
    }) => {
        return async () => {
            try {
                const resp = await vscode.window.showInputBox({
                    title,
                    prompt: "Enter the song you want to play.",
                });
                if (!resp) return;
                const tracks = (await spotifyApi.searchTracks(resp)).body
                    .tracks;
                if (tracks === undefined || tracks.items.length === 0)
                    throw new Error("No results found");
                const _temp = tracks.items[0];
                const getName = (item: typeof _temp) => {
                    const artists = item.artists.map((artist) => artist.name);
                    return `${item.name} By ${artists.join(", ")}`;
                };
                const songs = tracks.items.slice(0, 5);
                let chosenTrackUri: string;
                if (confirm) {
                    const choice = await vscode.window.showQuickPick(
                        songs.map((song) => getName(song)),
                        {
                            title,
                            placeHolder: "Pick which song you'd like to play",
                        }
                    );
                    if (!choice) return;
                    const chosenTrack = songs
                        .filter((song) => getName(song) === choice)
                        .at(0)!;
                    chosenTrackUri = chosenTrack.uri;
                } else {
                    chosenTrackUri = songs.at(0)?.uri as string;
                }
                await handleCommand({
                    handlerId,
                    payload: chosenTrackUri,
                });
                showInformationMessage(
                    "The action was completed successfully!"
                );
            } catch (e) {
                handleError(e);
            }
        };
    };

    registerCommand(
        "playTrack",
        true,
        playTrackTemplate({
            confirm: true,
            title: "Play track",
            handlerId: "playTrack",
        })
    );

    registerCommand(
        "playTrackWithoutConfirmation",
        true,
        playTrackTemplate({
            title: "Play Track Without Confirmation",
            handlerId: "playTrackWithoutConfirmation",
            confirm: false,
        })
    );

    registerCommand(
        "playTrackWithoutContext",
        true,
        playTrackTemplate({
            title: "Play Track Without Context",
            handlerId: "playTrackWithoutContext",
            confirm: true,
        })
    );

    registerCommand(
        "playTrackWithoutContextWithoutConfirmation",
        true,
        playTrackTemplate({
            title: "Play Track Without Context",
            handlerId: "playTrackWithoutContextWithoutConfirmation",
            confirm: false,
        })
    );

    registerCommand(
        "addToQueue",
        true,
        playTrackTemplate({
            title: "Add Track To Queue",
            handlerId: "addToQueue",
            confirm: true,
        })
    );

    registerCommand(
        "addToQueueWithoutConfirmation",
        true,
        playTrackTemplate({
            title: "Add Track To Queue",
            handlerId: "addToQueueWithoutConfirmation",
            confirm: false,
        })
    );

    registerCommand("removeFromLikedSongs", true, async () => {
        try {
            const resp = await spotifyApi.getMyCurrentPlayingTrack();
            if (!resp.body.item) {
                throw new Error("Currently not playing anything");
            }
            const trackId = resp.body.item.id;
            await handleCommand({
                handlerId: "removeFromLikedSongs",
                payload: trackId,
            });
            showInformationMessage(
                "The song was removed from your liked songs."
            );
        } catch (e) {
            handleError(e);
        }
    });

    registerCommand("addToLikedSongs", true, async () => {
        try {
            const resp = await spotifyApi.getMyCurrentPlayingTrack();
            if (!resp.body.item) {
                throw new Error("Currently not playing anything");
            }
            const trackId = resp.body.item.id;
            await handleCommand({
                handlerId: "addToLikedSongs",
                payload: trackId,
            });
            showInformationMessage("The song was added to your liked songs.");
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
            showInformationMessage(
                "The song was seeked to the given position successfully!"
            );
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
            showInformationMessage("The device was switched successfully!");
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
                showInformationMessage(successMsg);
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
            case "playTrack":
            case "playTrackWithoutConfirmation":
                await spotifyApi.addToQueue(payload);
                return await spotifyApi.skipToNext();
            case "addToQueue":
            case "addToQueueWithoutConfirmation":
                return await spotifyApi.addToQueue(payload);
            case "addToLikedSongs":
                return await spotifyApi.addToMySavedTracks([payload]);
            case "removeFromLikedSongs":
                return await spotifyApi.removeFromMySavedTracks([payload]);
            case "playTrackWithoutContext":
            case "playTrackWithoutContextWithoutConfirmation":
                return await spotifyApi.play({ uris: [payload] });
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
