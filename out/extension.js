"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const server_1 = require("./server");
const server = server_1.app.listen(constants_1.PORT, () => {
    console.log(`Listening on the url *:${constants_1.PORT}`);
});
async function activate(context) {
    (0, utils_1.updateGlobalState)(context.globalState);
    await (0, utils_1.refreshToken)();
    utils_1.spotifyApi.setAccessToken((await (0, utils_1.getAccessToken)()));
    utils_1.spotifyApi.setRefreshToken((await (0, utils_1.getRefreshToken)()));
    try {
        const user = await utils_1.spotifyApi.getMe();
        (0, utils_1.updateIsLoggedIn)(true);
        (0, utils_1.setRefreshInterval)();
    }
    catch (e) {
        vscode.window.showWarningMessage("Spotify Controller Not Logged In. Please Login");
        (0, utils_1.updateIsLoggedIn)(false);
    }
    constants_1.commands.forEach((command) => registerSpotifyCommand(command));
    registerCommand("login", false, () => {
        vscode.window.showInformationMessage("Opening the login url. Please Authenticate.");
        vscode.env.openExternal(vscode.Uri.parse(`${constants_1.BACKEND_URI}/auth/login`));
    });
    registerCommand("logout", false, async () => {
        await (0, utils_1.setAccessToken)("");
        await (0, utils_1.setRefreshToken)("");
        utils_1.spotifyApi.setAccessToken("");
        utils_1.spotifyApi.setRefreshToken("");
        vscode.window.showInformationMessage("Spotify account was successfully logged out");
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
                }
                catch (e) {
                    return "The value needs to be in the range [0, 100].";
                }
            },
        });
        if (!resp || resp.length === 0)
            return;
        try {
            await handleCommand({
                handlerId: "setVolume",
                payload: resp,
            });
        }
        catch (e) {
            (0, utils_1.handleError)(e);
        }
    });
    const playTrackTemplate = ({ title, handlerId, }) => {
        return async () => {
            try {
                const resp = await vscode.window.showInputBox({
                    title,
                    prompt: "Enter the song you want to play.",
                });
                if (!resp)
                    return;
                const tracks = (await utils_1.spotifyApi.searchTracks(resp)).body
                    .tracks;
                if (tracks === undefined || tracks.items.length === 0)
                    throw new Error("No results found");
                const _temp = tracks.items[0];
                const getName = (item) => {
                    const artists = item.artists.map((artist) => artist.name);
                    return `${item.name} By ${artists.join(", ")}`;
                };
                const songs = tracks.items.slice(0, 5);
                const choice = await vscode.window.showQuickPick(songs.map((song) => getName(song)), {
                    title,
                    placeHolder: "Pick which song you'd like to play",
                });
                if (!choice)
                    return;
                const chosenTrack = songs
                    .filter((song) => getName(song) === choice)
                    .at(0);
                await handleCommand({
                    handlerId,
                    payload: chosenTrack.uri,
                });
            }
            catch (e) {
                (0, utils_1.handleError)(e);
            }
        };
    };
    registerCommand("playTrack", true, playTrackTemplate({
        title: "Play track",
        handlerId: "playTrack",
    }));
    registerCommand("seek", true, async () => {
        try {
            const resp = await utils_1.spotifyApi.getMyCurrentPlayingTrack();
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
                    }
                    catch (e) {
                        return `The value needs to be in the range [0, ${duration - 1}]`;
                    }
                },
            });
            if (!seekTo)
                return;
            await handleCommand({
                handlerId: "seek",
                payload: Number.parseInt(seekTo) * 1000,
            });
        }
        catch (e) {
            (0, utils_1.handleError)(e);
        }
    });
    registerCommand("switchDevice", true, async () => {
        const resp = await utils_1.spotifyApi.getMyDevices();
        let activeDevice = "";
        const options = resp.body.devices.filter((device) => {
            if (device.is_active) {
                activeDevice = device.name;
            }
            return !device.is_active;
        });
        if (options.length === 0) {
            vscode.window.showWarningMessage("Cannot activate command. There is only one device available");
            return;
        }
        const choice = await vscode.window.showQuickPick(options.map((option) => option.name), {
            title: "Switch Device",
            placeHolder: `Currently playing on ${activeDevice}`,
        });
        if (!choice)
            return;
        const device = options.filter((val) => val.name === choice).at(0);
        try {
            handleCommand({
                handlerId: "switchDevice",
                payload: [device.id],
            });
        }
        catch (e) {
            (0, utils_1.handleError)(e);
        }
    });
    registerCommand("playPause", true, async () => {
        try {
            const isPlaying = await (0, utils_1.getPlayingStatus)();
            vscode.commands.executeCommand(`${constants_1.appId}.${isPlaying ? "pause" : "play"}`);
        }
        catch (e) {
            (0, utils_1.handleError)(e);
        }
    });
    function registerCommand(commandId, authRequired, func) {
        context.subscriptions.push(vscode.commands.registerCommand(`${constants_1.appId}.${commandId}`, authRequired ? (0, utils_1.protectedCommand)(func) : func));
    }
    function registerSpotifyCommand({ commandId, successMsg, handlerId, payload, }) {
        registerCommand(commandId, true, async () => {
            try {
                if (!handlerId)
                    handlerId = commandId;
                await handleCommand({ handlerId, payload });
                vscode.window.showInformationMessage(successMsg);
            }
            catch (e) {
                (0, utils_1.handleError)(e);
            }
        });
    }
    async function handleCommand({ handlerId, payload, }) {
        switch (handlerId) {
            case "nextSong":
                return await utils_1.spotifyApi.skipToNext();
            case "prevSong":
                return await utils_1.spotifyApi.skipToPrevious();
            case "pause":
                return await utils_1.spotifyApi.pause();
            case "play":
                return await utils_1.spotifyApi.play();
            case "shuffle":
                return await utils_1.spotifyApi.setShuffle(payload);
            case "repeat":
                return await utils_1.spotifyApi.setRepeat(payload);
            case "setVolume":
                return await utils_1.spotifyApi.setVolume(payload);
            case "switchDevice":
                return await utils_1.spotifyApi.transferMyPlayback(payload);
            case "seek":
                return await utils_1.spotifyApi.seek(payload);
            case "playTrack":
                await utils_1.spotifyApi.addToQueue(payload);
                return await utils_1.spotifyApi.skipToNext();
            default:
                vscode.window.showWarningMessage("The given command was not found.");
                return;
        }
    }
}
exports.activate = activate;
function deactivate() {
    server.close(() => {
        console.log(`Stopped listening on the url *:${constants_1.PORT}`);
    });
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map