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
    const authKey = await (0, utils_1.getAccessToken)();
    if (!authKey) {
        console.log("setting authKey");
        await (0, utils_1.setAccessToken)("thisismysupersecretauthkey");
        console.log(await (0, utils_1.getAccessToken)());
    }
    else {
        console.log(authKey);
    }
    console.log(constants_1.CLIENT_ID);
    console.log(constants_1.CLIENT_SECRET);
    registerCommand("login", false, () => {
        vscode.window.showInformationMessage("Opening the login url. Please Authenticate.");
        vscode.env.openExternal(vscode.Uri.parse(`${constants_1.BACKEND_URI}/auth/login`));
    });
    registerCommand("playPause", true, () => {
        vscode.window.showInformationMessage("The song was played/paused.");
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