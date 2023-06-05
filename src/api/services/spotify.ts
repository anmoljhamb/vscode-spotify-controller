import SpotifyWebApi from "spotify-web-api-node";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "../../constants";

export const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
});
