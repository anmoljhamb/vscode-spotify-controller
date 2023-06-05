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
    registerCommand("playPause", true, async () => {
        try {
            const isPlaying = await (0, utils_1.getPlayingStatus)();
            let message;
            if (isPlaying) {
                utils_1.spotifyApi.pause();
                message = "The song was paused";
            }
            else {
                utils_1.spotifyApi.play();
                message = "The song was resumed";
            }
            vscode.window.showInformationMessage(message);
        }
        catch (e) {
            if (e instanceof Error) {
                vscode.window.showErrorMessage(e.message);
            }
        }
    });
    registerCommand("helloWorld", false, () => {
        vscode.window.showInformationMessage("Hello World from the spotify controller extension.");
    });
    function registerCommand(commandId, authRequired, func) {
        context.subscriptions.push(vscode.commands.registerCommand(`${constants_1.appId}.${commandId}`, authRequired ? (0, utils_1.protectedCommand)(func) : func));
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