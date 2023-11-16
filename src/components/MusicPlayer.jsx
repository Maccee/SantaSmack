import React, { useState, useEffect, useRef } from "react";
import MusicOn from "../assets/music_on.svg";
import MusicOff from "../assets/music_off.svg";
import MusicNext from "../assets/music_next.svg";


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
 

  const handleMuteClick = () => {
    setMute((prevMute) => !prevMute); // Toggles the mute state
    
    console.log("mute clicked", !mute); // Logging the new state
  };

  return (
    <>
      <div className="button-container">
        <button onClick={toggleMusic}>Toggle Music
          {isPlaying ? (
            <img src={MusicOff} className="music-svg" />
          ) : (
            <img src={MusicOn} className="music-svg" />
          )}
        </button>
        {isPlaying && (
          <button onClick={playNextTrack}>Play Next
            <img src={MusicNext} className="music-svg" />
          </button>
        )}
        {!mute ? (
          <button onClick={() => handleMuteClick()}>mute</button>
        ) : (
          <button onClick={() => handleMuteClick()}>unmute</button>
        )}
      </div>
    </>
  );
};
export default MusicPlayer;
