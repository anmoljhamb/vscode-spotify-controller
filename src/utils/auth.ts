import axios from "axios";
import * as vscode from "vscode";
import { BACKEND_URI, appId } from "../constants";
import {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setLoggedInState,
    setRefreshToken,
} from "./tokenManager";

export const refreshToken = async () => {
    let _refreshToken = (await getRefreshToken()) as string;
    try {
        const resp = await axios.post(`${BACKEND_URI}/auth/refreshToken`, {
            refreshToken: _refreshToken,
        });
        await setAccessToken(resp.data.access_token);
        if (resp.data.refresh_token)
            await setRefreshToken(resp.data.refresh_token);
        await setLoggedInState(true);
        console.log("Access Token refreshed successfully!");
    } catch (e) {
        console.log("Error while refreshing");
        console.error(e);
        vscode.window.showWarningMessage(
            "There was an error while refreshing access token. Please login again"
        );
        await setAccessToken("");
        await setRefreshToken("");
        await setLoggedInState(false);
    }
};

export const intervalTime = (3600 - 60) * 1000;

export let refreshInterval: NodeJS.Timer;

export const setRefreshInterval = () => {
    console.log("setting refresh interval");
    refreshInterval = setInterval(refreshToken, intervalTime);
};

export const clearRefreshInterval = () => {
    console.log("clear refresh interval");
    if (refreshInterval) clearInterval(refreshInterval);
};

export const showLoginMessage = async () => {
    const choice = await vscode.window.showWarningMessage(
        "You're currently not logged in. Please Login",
        "Login"
    );
    if (!choice) return;
    if (choice) {
        vscode.commands.executeCommand(`${appId}.login`);
    }
};

export const isCurrentlyLoggedIn = async () => {
    const accessToken = (await getAccessToken()) as string;
    const refreshToken = (await getRefreshToken()) as string;
    if (!accessToken || accessToken.length === 0) return false;
    if (!refreshToken || refreshToken.length === 0) return false;
    return true;
};
