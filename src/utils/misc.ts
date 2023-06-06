import * as vscode from "vscode";
import { SHOW_ALERTS } from "../constants";

export const handleError = (e: any) => {
    if (e instanceof Error) vscode.window.showErrorMessage(e.message);
    console.error(e);
};

export const showInformationMessage = (message: string) => {
    if (SHOW_ALERTS) {
        vscode.window.showInformationMessage(message);
    }
};
