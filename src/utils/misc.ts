import * as vscode from "vscode";

export const handleError = (e: any) => {
    if (e instanceof Error) vscode.window.showErrorMessage(e.message);
    console.log(e);
};
