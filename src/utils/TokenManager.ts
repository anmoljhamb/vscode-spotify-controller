import * as vscode from "vscode";
import { appId } from "../constants";

const authTokenKey = `${appId}_authTokenId`;
const refreshTokenKey = `${appId}_refreshTokenId`;

let globalState: vscode.Memento;

export const updateGlobalState = (_globalState: vscode.Memento) =>
    (globalState = _globalState);
export const getAuthToken = () => globalState.get(authTokenKey);
export const getRefreshToken = () => globalState.get(refreshTokenKey);
export const setAuthToken = (token: string) =>
    globalState.update(authTokenKey, token);
export const setRefreshToken = (token: string) =>
    globalState.update(refreshTokenKey, token);
