import * as vscode from "vscode";
import { app } from "./api";
import { PORT, appId } from "./constants";
import {
    getAuthToken,
    protectedCommand,
    setAuthToken,
    updateGlobalState,
} from "./utils";

const server = app.listen(PORT, () => {
    console.log(`Listening on the url *:${PORT}`);
});

export async function activate(context: vscode.ExtensionContext) {
    updateGlobalState(context.globalState);

    const authKey = await getAuthToken();
    if (!authKey) {
        console.log("setting authKey");
        await setAuthToken("thisismysupersecretauthkey");
        console.log(await getAuthToken());
    } else {
        console.log(authKey);
    }

    registerCommand("playPause", true, () => {
        vscode.window.showInformationMessage("The song was played/paused.");
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
}

export function deactivate() {
    server.close(() => {
        console.log(`Stopped listening on the url *:${PORT}`);
    });
}
