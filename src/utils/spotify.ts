import SpotifyWebApi from "spotify-web-api-node";
import { CLIENT_ID, REDIRECT_URI } from "../constants";

export const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
});

const scopes = [
    "playlist-read-private",
    "user-read-private",
    "user-read-email",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-modify-playback-state",
    "app-remote-control",
    "streaming",
];

export const authUrl = spotifyApi.createAuthorizeURL(
    scopes,
    "some-state-of-my-choice"
);

export const getPlayingStatus = async () => {
    const resp = await spotifyApi.getMyCurrentPlaybackState();
    handleResp(resp);
    return resp.body.is_playing;
};

export const handleResp = (resp: Response<any>) => {
    if (resp.statusCode === 204) throw new Error("No Spotify Instance Found");
};
