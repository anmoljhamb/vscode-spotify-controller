# VSCode Spotify Controller

<!-- TOC --><a name="vscode-spotify-controller"></a>

The VSCode Spotify Extension is a powerful tool that enhances your coding experience by bringing the control of Spotify directly to your Visual Studio Code editor. With this extension, you can seamlessly manage your Spotify playback, search for music, adjust volume, and more, all without leaving your coding environment.

## Table Of Content

-   [VSCode Spotify Controller](#vscode-spotify-controller)
    -   [Table Of Content](#table-of-content)
    -   [Beta Testing](#beta-testing)
    -   [Features](#features)
    -   [Requirements](#requirements)
    -   [Extension Settings](#extension-settings)
    -   [API](#api)
    -   [Installation (Pre-release Version)](#installation-pre-release-version)
    -   [Commands](#commands)
    -   [Troubleshooting](#troubleshooting)
    -   [Known Issues](#known-issues)
    -   [Authentication \& Authorization Flow](#authentication--authorization-flow)
    -   [Contributing](#contributing)

<!-- TOC --><a name="beta-testing"></a>

## Beta Testing

The VSCode Spotify Extension is currently in development mode and available for beta testing. If you would like to test the extension, please contact me using any of the methods mentioned on my [GitHub profile](https://github.com/anmoljhamb). I will add you to the list of beta users, and you can start using the extension and provide valuable feedback.

<!-- TOC --><a name="features"></a>

## Features

-   **Control Playback**: Play, pause, and skip tracks directly from Visual Studio Code. Stay in the coding flow while enjoying your favorite tunes.

-   **Volume Adjustment**: Fine-tune the volume of your Spotify music without switching to the Spotify app. Easily increase or decrease the volume to create the perfect coding ambiance.

-   **Search for Music**: Play tracks, and artists within Spotify without interrupting your workflow. Quickly search for specific music and play sounds while coding.

-   **Queue Management**: Add tracks to your Spotify queue effortlessly. Choose between adding tracks without confirmation or with a confirmation prompt, allowing for a personalized music listening experience.

-   **Repeat and Shuffle**: Customize your listening experience with repeat and shuffle options. Set repeat mode to the current track or context, and enable or disable shuffle mode to suit your preferences.

<!-- -   **Keyboard Shortcuts**: Control your music playback conveniently with intuitive keyboard shortcuts. Play, pause, adjust volume, skip tracks, and perform various actions without lifting your hands off the keyboard. -->

-   **Device Switching**: Seamlessly switch playback between different Spotify devices. Enjoy your music wherever you prefer, whether it's your computer, mobile device, or smart speaker.

-   **Playlist Management**: Access and play your favorite Spotify playlists directly from Visual Studio Code. Enjoy your Liked Songs playlist, play top songs of specific artists, and effortlessly manage your music library.

-   **Information Alerts**: Stay informed about your Spotify actions with optional information alerts. Receive notifications for successful login, logout, queue additions, and more.

<!-- TOC --><a name="requirements"></a>

## Requirements

-   **Spotify Premium**: This extension requires a Spotify Premium subscription to use. Please ensure that you have an active Spotify Premium account before using the extension. Free Spotify accounts do not have the necessary access to control playback and perform other advanced features provided by this extension.

<!-- TOC --><a name="extension-settings"></a>

## Extension Settings

This extension contributes the following settings:

-   **Spotify Controller: Client ID**: The client ID from the Spotify Developer Console. You can modify this setting to use your own Spotify app by providing the appropriate client ID. This is useful if you want to fork the repository and create your own Spotify app for authentication purposes.

-   **Spotify Controller: Show Information Alerts**: Show information alerts when a given action is successful. By default, this setting is enabled (`true`). If you find the information alerts to be disruptive or unnecessary, you can disable them by setting this option to `false`.

To modify the `spotifyControllerClientId` or `spotifyControllerShowInformationAlerts` settings, open your Visual Studio Code settings (`Preferences > Settings`) and search for "Spotify Controller Client ID" or "Spotify Controller Show Information Alerts".

<!-- TOC --><a name="api"></a>

## API

The VSCode Spotify Extension utilizes the Spotify Web API to control your Spotify playback directly from Visual Studio Code. The extension communicates with a server component to handle authentication and token refreshing. The server component is responsible for obtaining and managing the access token required for accessing the Spotify Web API.

To learn more about the server part of the extension, you can visit the [VSCode Spotify Controller Server](https://github.com/anmoljhamb/vscode-spotify-controller-server) repository. The server component plays a crucial role in refreshing the access token and ensuring seamless integration with the Spotify Web API.

Feel free to explore the server repository for more details on how the access token refresh mechanism works and how it enables the extension to control Spotify playback within Visual Studio Code.

<!-- TOC --><a name="installation-pre-release-version"></a>

## Installation (Pre-release Version)

**Note: The extension is currently in development mode and not published on the VSCode Marketplace. Follow these steps to install the pre-release version:**

1. Download the pre-release version [v0.0.2-beta](https://github.com/anmoljhamb/vscode-spotify-controller/releases/tag/v0.0.2-beta) from the release page.

2. Save the downloaded file (`vscode-spotify-controller-0.0.2.vsix`) to a location you can easily access.

3. Open Visual Studio Code.

4. Go to the Extensions view by clicking on the square icon on the left sidebar or pressing `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS).

5. Click on the ellipsis menu (three dots) located at the top-right corner and select "Install from VSIX..."

6. Navigate to the downloaded file (`vscode-spotify-controller-0.0.2-beta.vsix`), select it, and click "Open".

7. Wait for the extension to install. Once installed, you will see a prompt to reload Visual Studio Code. Click on the "Reload" button to activate the extension.

That's it! You have successfully installed the pre-release version of the VSCode Spotify Extension. Please note that this version may contain bugs or incomplete features as it's still under development.

If you encounter any issues or have feedback, please report them to the extension's [GitHub repository](https://github.com/anmoljhamb/vscode-spotify-controller).

Thank you for your interest in beta testing the VSCode Spotify Controller Extension. Enjoy controlling Spotify directly from Visual Studio Code!

<!-- TOC --><a name="commands"></a>

## Commands

-   **Login**: `spotify-controller.login`
-   **Logout**: `spotify-controller.logout`
-   **Play/Pause**: `spotify-controller.playPause`
-   **Pause**: `spotify-controller.pause`
-   **Play**: `spotify-controller.play`
-   **Shuffle Off**: `spotify-controller.shuffleOff`
-   **Shuffle On**: `spotify-controller.shuffleOn`
-   **Set Repeat Off**: `spotify-controller.setRepeatOff`
-   **Set Repeat to Current Context**: `spotify-controller.setRepeatContext`
-   **Set Repeat to Track**: `spotify-controller.setRepeatTrack`
-   **Next Song**: `spotify-controller.nextSong`
-   **Seek**: `spotify-controller.seek`
-   **Add To Queue Without Confirmation**: `spotify-controller.addToQueueWithoutConfirmation`
-   **Add To Queue**: `spotify-controller.addToQueue`
-   **Play Track With In Context**: `spotify-controller.playTrack`
-   **Play Track With In Context Without Confirmation**: `spotify-controller.playTrackWithoutConfirmation`
-   **Play Track**: `spotify-controller.playTrackWithoutContext`
-   **Play Track Without Confirmation**: `spotify-controller.playTrackWithoutContextWithoutConfirmation`
-   **Play Artist**: `spotify-controller.playArtist`
-   **Switch Device**: `spotify-controller.switchDevice`
-   **Previous Song**: `spotify-controller.prevSong`
-   **Set Volume**: `spotify-controller.setVolume`
-   **Copy Current Song to Clipboard**: `spotify-controller.copyToClipboard`
-   **Remove Current Song from Liked Songs**: `spotify-controller.removeFromLikedSongs`
-   **Play Playlist**: `spotify-controller.playPlaylist`
-   **Play Top Songs**: `spotify-controller.playTopSongs`
-   **Play Liked Songs**: `spotify-controller.playLikedSongs`
-   **Add Current Song to Liked Songs**: `spotify-controller.addToLikedSongs`

<!-- TOC --><a name="troubleshooting"></a>

## Troubleshooting

If you encounter any issues while using the VSCode Spotify Extension, you can try the following troubleshooting steps:

-   **Error: NO_ACTIVE_DEVICE**: If you receive an error message with the code "NO_ACTIVE_DEVICE," ensure that there is an instance of Spotify open somewhere with your current account logged in. If you already have Spotify open and the error still persists, try playing a track in Spotify once. This should activate an active device and allow the extension to work as intended.

-   **Error: Access Token Expired**: If you receive an error message indicating that the access token has expired, try logging out and logging back in to refresh the access token. This error may occur due to one of the known issues discussed in the "Known Issues" section of this documentation.

If the above troubleshooting steps do not resolve your issue, please refer to the "Known Issues" section or consider opening an issue on the GitHub repository for further assistance.

<!-- TOC --><a name="known-issues"></a>

## Known Issues

-   **Issue: Access Token Expired after Extended Idle Period**: If you leave the instance of VSCode open and your device remains idle for an extended period, such as when it goes to sleep, the interval refresh the access token won't be called, leading to an error stating "Access Token Expired." To resolve this issue, one can simply restart their instance of VSCode, or simply logout and login again.

-   **Issue: Limited Options to Play a Track**: Currently, the Spotify Web API offers only one option to play a track, which erases the current context. This means that if you use this option, any playlist or album you had playing will be cleared, and you will need to start it again. To mitigate this limitation, the extension provides an alternative option that adds the given song to the queue and skips to the next track, preserving the context. However, a bug arises if the user already has songs in the queue. In such cases, the extension will switch to the queued song instead of the intended track.

-   **Issue: Restart Required after Disabling Informational Alerts**: If you disable the informational alerts in the extension settings, a restart of the VSCode instance is required for the changes to take effect. Please keep this in mind if you choose to disable the alerts.

If you encounter any other issues or have questions about the extension, please consider opening an issue on the GitHub repository for further assistance.

<!-- TOC --><a name="authentication-authorization-flow"></a>

## Authentication & Authorization Flow

**Authentication:**

The authentication process in the extension follows the OAuth 2.0 flow, specifically the Authorization Code Grant flow. When a user executes the login command, the extension checks if the user is already logged in. If not, it opens the authorization URL, generated using the Spotify Web API Node library. This URL includes the required scopes, redirect URI, and client ID of the Spotify Web application.

Upon successful login, the user is redirected to the callback URL `http://localhost:61234/auth/callback`. The extension hosts a simple Express server on this URL. Once the callback is received, the server retrieves the authorization code as a GET query parameter. This code is necessary to obtain the access and refresh tokens.

**Authorization:**

To securely obtain the access and refresh tokens, the extension utilizes a separate server, which is responsible for granting access tokens and refreshing them. This server is detailed in the following repository: [https://github.com/anmoljhamb/vscode-spotify-controller-server](https://github.com/anmoljhamb/vscode-spotify-controller-server).

Once the access and refresh tokens are granted, the extension saves them in the global state of VS Code. An interval is set to refresh the access token approximately one minute before it expires. This ensures seamless access to Spotify functionalities even if the user closes and reopens the extension. If a user chooses to log out, the access and refresh tokens are removed from the global state.

<!-- TOC --><a name="contributing"></a>

## Contributing

Contributions to the VSCode Spotify Controller Server are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/anmoljhamb/vscode-spotify-controller).
