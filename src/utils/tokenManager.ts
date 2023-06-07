import * as vscode from "vscode";
import { appId } from "../constants";

const accessTokenKey = `${appId}_authTokenId`;
const refreshTokenKey = `${appId}_refreshTokenId`;
const loggedInStateKey = `${appId}_loggedInStateKey`;

let globalState: vscode.Memento;

export const updateGlobalState = (_globalState: vscode.Memento) =>
    (globalState = _globalState);
export const getAccessToken = () => globalState.get(accessTokenKey);
export const getRefreshToken = () => globalState.get(refreshTokenKey);
export const getLoggedInState = () => globalState.get(loggedInStateKey);
export const setAccessToken = (token: string) =>
    globalState.update(accessTokenKey, token);
export const setRefreshToken = (token: string) =>
    globalState.update(refreshTokenKey, token);
export const setLoggedInState = (status: boolean) =>
    globalState.update(loggedInStateKey, status);
