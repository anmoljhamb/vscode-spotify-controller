import axios from "axios";
import * as vscode from "vscode";
import { BACKEND_URI } from "../constants";
import {
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from "./tokenManager";

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

export const refreshToken = async () => {
    let _refreshToken = (await getRefreshToken()) as string;
    try {
        const resp = await axios.post(`${BACKEND_URI}/auth/refreshToken`, {
            refreshToken: _refreshToken,
        });
        await setAccessToken(resp.data.access_token);
        if (resp.data.refresh_token)
            await setRefreshToken(resp.data.refresh_token);
        console.log("Access Token refreshed successfully!");
    } catch (e) {
        console.log("error while refreshing");
        console.log(e);
    }
};

export const intervalTime = (3600 - 60) * 1000;

export let refreshInterval: NodeJS.Timer;

export const setRefreshInterval = () => {
    refreshInterval = setInterval(refreshToken, intervalTime);
};

export const clearRefreshInterval = () => {
    if (refreshInterval) clearInterval(refreshInterval);
};
