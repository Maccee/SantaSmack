import React, { useState, useEffect, useRef, useCallback } from "react";

import musicOn from "../assets/music-on.webp";
import soundOn from "../assets/sound-on.webp";
import musicOff from "../assets/music-off.webp";
import soundOff from "../assets/sound-off.webp";

const MusicPlayer = ({ mute, setMute, musicVolume }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Initialize and handle track change
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(`${currentTrackIndex + 1}.mp3`);
    } else {
      audioRef.current.src = `${currentTrackIndex + 1}.mp3`;
    }
    audioRef.current.volume = musicVolume;

    const audio = audioRef.current;
    const playNextTrack = () => {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % 4);
    };

    if (isPlaying) {
      audio.play();
    }

    audio.addEventListener("ended", playNextTrack);
    return () => {
      audio.removeEventListener("ended", playNextTrack);
    };
  }, [currentTrackIndex, isPlaying]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteClick = () => {
    setMute((prevMute) => !prevMute);
  };

  return (
    <div className="audioControl">
      <button onClick={toggleMusic}>
        {isPlaying ? (
          <img src={musicOn} alt="Music On" />
        ) : (
          <img src={musicOff} alt="Music Off" />
        )}
      </button>
      <button onClick={handleMuteClick}>
        {!mute ? (
          <img src={soundOn} alt="Sound On" />
        ) : (
          <img src={soundOff} alt="Sound Off" />
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
