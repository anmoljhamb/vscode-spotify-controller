import axios from "axios";
import { BACKEND_URI } from "../constants";
import {
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
