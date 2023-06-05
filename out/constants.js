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
exports.commands = exports.REDIRECT_URI = exports.SHOW_ALERTS = exports.CLIENT_SECRET = exports.CLIENT_ID = exports.BACKEND_URI = exports.PORT = exports.appId = void 0;
const vscode = __importStar(require("vscode"));
exports.appId = "spotify-controller";
exports.PORT = vscode.workspace
    .getConfiguration()
    .get("spotifyControllerApiPort");
exports.BACKEND_URI = `http://localhost:${exports.PORT}`;
exports.CLIENT_ID = vscode.workspace
    .getConfiguration()
    .get("spotifyControllerClientId");
exports.CLIENT_SECRET = vscode.workspace
    .getConfiguration()
    .get("spotifyControllerClientSecret");
exports.SHOW_ALERTS = vscode.workspace
    .getConfiguration()
    .get("spotifyControllerShowInformationAlerts");
exports.REDIRECT_URI = `${exports.BACKEND_URI}/auth/callback`;
exports.commands = [
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
//# sourceMappingURL=constants.js.map