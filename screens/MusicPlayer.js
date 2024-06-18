import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Image, PanResponder } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrackPlayer, { Capability, State, usePlaybackState, useProgress, Event, useTrackPlayerEvents } from 'react-native-track-player';
import { songs, images } from '../model/data'; // Adjust the path as needed

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const SingleButtonPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playBackState = usePlaybackState();
  const { position, duration } = useProgress();
  const isPlayerInitialized = useRef(false);
  const progressBarRef = useRef(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);

  useEffect(() => {
    const setupPlayer = async () => {
      if (!isPlayerInitialized.current) {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
        });
        isPlayerInitialized.current = true;
        await TrackPlayer.add([songs[currentIndex]]);
      }
    };

    setupPlayer();

    return () => {
      TrackPlayer.stop();
    };
  }, []);

  useEffect(() => {
    const loadTrack = async () => {
      if (isPlayerInitialized.current) {
        await TrackPlayer.reset();
        await TrackPlayer.add([songs[currentIndex]]);
        if (isPlaying) {
          await TrackPlayer.play();
        }
      }
    };

    loadTrack();
  }, [currentIndex]);

  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackQueueEnded], (event) => {
    console.log("Playback state changed:", event.state);
    if (event.type === Event.PlaybackQueueEnded) {
      setCurrentIndex((prevIndex) => (prevIndex === songs.length - 1 ? 0 : prevIndex + 1));
    } else {
      setIsPlaying(event.state === State.Playing);
    }
  });

  useEffect(() => {
    console.log("Current position:", position);
    console.log("Song duration:", duration);
  }, [position, duration]);

  const handlePlayPress = async () => {
    const playerState = await TrackPlayer.getState();
    console.log("Player state before handling play press:", playerState);
    if (playerState === State.Playing) {
      await TrackPlayer.pause();
    } else if (playerState === State.Paused || playerState === State.Ready || playerState === State.Stopped) {
      await TrackPlayer.play();
    }
    console.log("Player state after handling play press:", await TrackPlayer.getState());
  };

  const handleBackPress = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleForwardPress = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const getProgress = () => {
    return position / duration || 0;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsSeeking(true);
      },
      onPanResponderMove: (event, gestureState) => {
        const newPosition = Math.max(0, Math.min(gestureState.dx, progressWidth));
        setSeekPosition(newPosition);
      },
      onPanResponderRelease: async (event, gestureState) => {
        const newPosition = Math.max(0, Math.min(gestureState.dx, progressWidth));
        const newProgress = newPosition / progressWidth;
        const newTrackPosition = newProgress * duration;
        await TrackPlayer.seekTo(newTrackPosition);
        setIsSeeking(false);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{songs[currentIndex].title}</Text>
      <Text style={styles.artist}>{songs[currentIndex].artist}</Text>
      <Image source={images[currentIndex]} style={styles.image} />
      <View style={styles.progressContainer}>
        <View style={styles.progressBar} {...panResponder.panHandlers} ref={progressBarRef}>
          <View style={[styles.progress, { width: `${getProgress() * 100}%` }]} />
          <View
            style={[
              styles.progressBall,
              {
                left: `${getProgress() * 100}%`,
                transform: [{ translateX: -10 }],
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{formatTime(position)} / {formatTime(duration)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Ionicons name="arrow-down-circle-outline" size={32} color="black" />
        <Ionicons name="caret-back-outline" size={32} color="black" onPress={handleBackPress} />
        <Ionicons 
          name={isPlaying ? "pause-outline" : "play-outline"} 
          size={32} 
          color="black" 
          onPress={handlePlayPress} 
        />
        <Ionicons name="caret-forward-outline" size={32} color="black" onPress={handleForwardPress} />
        <Ionicons name="heart-outline" size={32} color="black" />
      </View>
    </View>
  );
};

export default SingleButtonPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3e0ea',  // Nice background color
    paddingHorizontal: 20,
  },
  image: {
    width: '90%',
    height: '50%',
    borderRadius: 20,
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderRadius:15,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
    width: '100%',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 10,
  },
  progressContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  progress: {
    height: '100%',
    backgroundColor: '#000900',
  },
  progressBall: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000900',
    top: -5,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artist: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginBottom: 10,
  },
});
