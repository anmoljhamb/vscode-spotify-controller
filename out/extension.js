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
        handlerId: "shuffle",
        payload: false,
    });
    registerSpotifyCommand({
        commandId: "shuffleOn",
        successMsg: "The shuffle was turned on successfully!",
        handlerId: "shuffle",
        payload: true,
    });
    registerCommand("playPause", true, async () => {
        try {
            const isPlaying = await (0, utils_1.getPlayingStatus)();
            vscode.commands.executeCommand(`${constants_1.appId}.${isPlaying ? "pause" : "play"}`);
        }
        catch (e) {
            if (e instanceof Error) {
                vscode.window.showErrorMessage(e.message);
            }
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
                if (e instanceof Error)
                    vscode.window.showErrorMessage(e.message);
                console.log(e);
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