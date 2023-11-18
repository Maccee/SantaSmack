import React, { useState, useEffect, useRef } from "react";
import { distanceMusicPlay } from "../SoundUtils";
import musicOn from "../assets/music-on.png";
import soundOn from "../assets/sound-on.png";
import musicOff from "../assets/music-off.png";
import soundOff from "../assets/sound-off.png";

const MusicPlayer = ({ mute, setMute }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Initialize the audioRef.current value only once, when the component mounts
  if (audioRef.current === null) {
    audioRef.current = new Audio(`1.mp3`);
    audioRef.current.volume = 0.1; // Set volume to 75%
  }

  // Effect for playing the next track
  useEffect(() => {
    const audio = audioRef.current;

    const playNextTrack = () => {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % 4);
    };

    audio.addEventListener("ended", playNextTrack);

    return () => {
      audio.removeEventListener("ended", playNextTrack);
    };
  }, []);

  // Effect for changing the track source and playing or pausing
  useEffect(() => {
    const audio = audioRef.current;
    audio.src = `${currentTrackIndex + 1}.mp3`; // Adjust the path accordingly
    if (isPlaying) {
      audio.load(); // Load the new source
      audio.play();
    } else {
      audio.pause();
    }
  }, [currentTrackIndex, isPlaying]);

  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % 4); // Assuming you have 4 tracks
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };
  const handleVolumeChange = (event) => {
    const volume = event.target.value;
    audioRef.current.volume = volume;
  };
  const handleSpeedChange = (event) => {
    setGameSpeed(event.target.value);
    console.log(gameSpeed);
  };

  const handleMuteClick = () => {
    setMute((prevMute) => !prevMute); // Toggles the mute state
    distanceMusicPlay(0, !mute); // Pass the opposite of the current mute state
    console.log("mute clicked", !mute); // Logging the new state
  };

  return (
    <>
      <div className="audioControl">
        <button onClick={toggleMusic}>
          {isPlaying ? <img src={musicOff} /> : <img src={musicOn} />}
        </button>

        {!mute ? (
          <button onClick={() => handleMuteClick()}>
            <img src={soundOff} />
          </button>
        ) : (
          <button onClick={() => handleMuteClick()}>
            <img src={soundOn} />
          </button>
        )}
      </div>
    </>
  );
};
export default MusicPlayer;
