import * as vscode from "vscode";

export let isLoggedIn = false;

export let updateIsLoggedIn = (status: boolean) => (isLoggedIn = status);

export const protectedCommand = (callback: () => void) => {
    if (isLoggedIn) return callback;
    return () => {
        vscode.window.showWarningMessage(
            "You are currently not logged in. You need to login."
        );
    };
};
