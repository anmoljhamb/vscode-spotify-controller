# VSCode Spotify Controller

The VSCode Spotify Extension is a powerful tool that enhances your coding experience by bringing the control of Spotify directly to your Visual Studio Code editor. With this extension, you can seamlessly manage your Spotify playback, search for music, adjust volume, and more, all without leaving your coding environment.

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

## Requirements

-   **Spotify Premium**: This extension requires a Spotify Premium subscription to use. Please ensure that you have an active Spotify Premium account before using the extension. Free Spotify accounts do not have the necessary access to control playback and perform other advanced features provided by this extension.

## Extension Settings

This extension contributes the following settings:

-   **Spotify Controller: Client ID**: The client ID from the Spotify Developer Console. You can modify this setting to use your own Spotify app by providing the appropriate client ID. This is useful if you want to fork the repository and create your own Spotify app for authentication purposes.

-   **Spotify Controller: Show Information Alerts**: Show information alerts when a given action is successful. By default, this setting is enabled (`true`). If you find the information alerts to be disruptive or unnecessary, you can disable them by setting this option to `false`.

To modify the `spotifyControllerClientId` or `spotifyControllerShowInformationAlerts` settings, open your Visual Studio Code settings (`Preferences > Settings`) and search for "Spotify Controller Client ID" or "Spotify Controller Show Information Alerts".

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

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.
