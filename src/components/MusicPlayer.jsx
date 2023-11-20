import React, { useState, useEffect, useRef } from "react";

import musicOn from "../assets/music-on.png";
import soundOn from "../assets/sound-on.png";
import musicOff from "../assets/music-off.png";
import soundOff from "../assets/sound-off.png";

const MusicPlayer = ({ mute, setMute }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  if (audioRef.current === null) {
    audioRef.current = new Audio(`1.mp3`);
    audioRef.current.volume = 0.4;
  }

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

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = `${currentTrackIndex + 1}.mp3`;
    if (isPlaying) {
      audio.load();
      audio.play();
    } else {
      audio.pause();
    }
  }, [currentTrackIndex, isPlaying]);

  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % 4);
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    const volume = event.target.value;
    audioRef.current.volume = volume;
  };

  const handleMuteClick = () => {
    setMute((prevMute) => !prevMute);
  };

  return (
    <>
      <div className="audioControl">
        <button onClick={toggleMusic}>
          {isPlaying ? <img src={musicOn} /> : <img src={musicOff} />}
        </button>

        {!mute ? (
          <button onClick={() => handleMuteClick()}>
            <img src={soundOn} />
          </button>
        ) : (
          <button onClick={() => handleMuteClick()}>
            <img src={soundOff} />
          </button>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;
