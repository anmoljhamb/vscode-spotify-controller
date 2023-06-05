import * as vscode from "vscode";
import { app } from "./api";

const server = app.listen(8080, () => {
    console.log(`Listening on the url *:8080`);
});

export function activate(context: vscode.ExtensionContext) {
    console.log(
        'Congratulations, your extension "spotify-controller" is now active!'
    );

    let disposable = vscode.commands.registerCommand(
        "spotify-controller.helloWorld",
        () => {
            vscode.window.showInformationMessage(
                "Hello World from SpotifyController!"
            );
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {
    server.close(() => {
        console.log(`Stopped listening on the url *:8080`);
    });
}
