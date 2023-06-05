import * as vscode from "vscode";
import { app } from "./api";
import { appId } from "./constants";
import { protectedCommand } from "./utils";

const server = app.listen(8080, () => {
    console.log(`Listening on the url *:8080`);
});

export function activate(context: vscode.ExtensionContext) {
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
        console.log(`Stopped listening on the url *:8080`);
    });
}
