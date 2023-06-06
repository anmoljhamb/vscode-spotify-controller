import * as vscode from "vscode";
import {
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from "./tokenManager";
import { spotifyApi } from "./spotify";

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
    /**
     * todo refresh the token from the backend instead.
     */
    console.log("refreshing token");
    spotifyApi.setRefreshToken((await getRefreshToken()) as string);
    try {
        let resp = await spotifyApi.refreshAccessToken();
        await setAccessToken(resp.body.access_token);
        let _refreshToken = resp.body.refresh_token;
        if (_refreshToken) await setRefreshToken(_refreshToken);
    } catch (e) {
        console.log(e);
        await setAccessToken("");
        await setRefreshToken("");
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
