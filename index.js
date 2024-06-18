import { AppRegistry } from 'react-native';
import App from './App';
import TrackPlayer from 'react-native-track-player';
import playbackService from './service';


AppRegistry.registerComponent('musicplayer_yt', () => App);
TrackPlayer.registerPlaybackService(() => playbackService);
