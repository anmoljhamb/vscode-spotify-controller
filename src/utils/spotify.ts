import SpotifyWebApi from "spotify-web-api-node";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "../constants";

export const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
});

export const getPlayingStatus = async () => {
    const resp = await spotifyApi.getMyCurrentPlaybackState();
    handleResp(resp);
    return resp.body.is_playing;
};

export const handleResp = (resp: Response<any>) => {
    if (resp.statusCode === 204) throw new Error("No Spotify Instance Found");
};
