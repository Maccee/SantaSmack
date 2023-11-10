import React, { useState, useEffect, useRef } from "react";
import MusicOn from "../assets/music_on.svg";
import MusicOff from "../assets/music_off.svg";
import MusicNext from "../assets/music_next.svg";
import { distanceMusicPlay } from "../SoundUtils";

const MusicPlayer = ({mute, setMute, gameSpeed, setGameSpeed}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [showSlider, setShowSlider] = useState(false);
  

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
    if (isPlaying) {
      setShowSlider(false);
    } else {
      setShowSlider(true);
    }
  };
  const handleVolumeChange = (event) => {
    const volume = event.target.value;
    audioRef.current.volume = volume;
  };
  const handleSpeedChange = (event) => {
    setGameSpeed(event.target.value);
    console.log(gameSpeed)
  };

  const handleMuteClick = () => {
    setMute(prevMute => !prevMute); // Toggles the mute state
    distanceMusicPlay(0, !mute); // Pass the opposite of the current mute state
    console.log("mute clicked", !mute); // Logging the new state
}

  return (
    <>
      <div className="button-container">
        <button onClick={toggleMusic}>
          {isPlaying ? (
            <img src={MusicOff} className="music-svg" />
          ) : (
            <img src={MusicOn} className="music-svg" />
          )}
        </button>
        {isPlaying && (
          <button onClick={playNextTrack}>
            <img src={MusicNext} className="music-svg" />
          </button>
        )}
        {!mute ? (
        <button className="music-svg" onClick={() => handleMuteClick()}>mute</button>
        ) : (
          <button className="music-svg" onClick={() => handleMuteClick()}>unmute</button>
        )}
        <input
          className="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={gameSpeed}
          onChange={handleSpeedChange}
        />
      </div>
      <div className={`slider-container ${showSlider ? "" : "hidden"}`}>
        <input
          className="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={audioRef.current.volume}
          onChange={handleVolumeChange}
        />
      </div>{" "}
      
    </>
  );
};
export default MusicPlayer;
