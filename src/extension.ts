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
    protectedCommand,
    setAccessToken,
    updateGlobalState,
} from "./utils";
import { app } from "./server";

const server = app.listen(PORT, () => {
    console.log(`Listening on the url *:${PORT}`);
});

export async function activate(context: vscode.ExtensionContext) {
    updateGlobalState(context.globalState);

    const authKey = await getAccessToken();
    if (!authKey) {
        console.log("setting authKey");
        await setAccessToken("thisismysupersecretauthkey");
        console.log(await getAccessToken());
    } else {
        console.log(authKey);
    }

    console.log(CLIENT_ID);
    console.log(CLIENT_SECRET);

    registerCommand("login", false, () => {
        vscode.window.showInformationMessage(
            "Opening the login url. Please Authenticate."
        );
        vscode.env.openExternal(vscode.Uri.parse(`${BACKEND_URI}/auth/login`));
    });

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