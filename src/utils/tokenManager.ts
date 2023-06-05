import * as vscode from "vscode";
import { appId } from "../constants";

const accessTokenKey = `${appId}_authTokenId`;
const refreshTokenKey = `${appId}_refreshTokenId`;

let globalState: vscode.Memento;

export const updateGlobalState = (_globalState: vscode.Memento) =>
    (globalState = _globalState);
export const getAccessToken = () => globalState.get(accessTokenKey);
export const getRefreshToken = () => globalState.get(refreshTokenKey);
export const setAccessToken = (token: string) =>
    globalState.update(accessTokenKey, token);
export const setRefreshToken = (token: string) =>
    globalState.update(refreshTokenKey, token);
