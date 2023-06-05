import * as vscode from "vscode";

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

// This method is called when your extension is deactivated
export function deactivate() {}
