import * as vscode from "vscode";
import { SHOW_ALERTS } from "../constants";
import { showLoginMessage } from "./auth";

export const handleError = (e: any) => {
    if (e instanceof Error) {
        if (e.message === "userNotLoggedIn") {
            showLoginMessage();
        } else vscode.window.showErrorMessage(e.message);
    }
    console.error(e);
};

export const showInformationMessage = (message: string) => {
    if (SHOW_ALERTS) {
        vscode.window.showInformationMessage(message);
    }
};
