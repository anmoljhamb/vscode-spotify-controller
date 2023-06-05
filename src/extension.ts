import * as vscode from "vscode";
import { app } from "./api";

const server = app.listen(8080, () => {
    console.log(`Listening on the url *:8080`);
});

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("spotify-controller.helloWorld", () => {
            vscode.window.showInformationMessage(
                "Hello world from the vscode spotify controller"
            );
        })
    );
}

export function deactivate() {
    server.close(() => {
        console.log(`Stopped listening on the url *:8080`);
    });
}
