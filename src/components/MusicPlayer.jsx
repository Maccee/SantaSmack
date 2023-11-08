import React, { useState, useEffect, useRef } from 'react';

const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Initialize the audioRef.current value only once, when the component mounts
  if (audioRef.current === null) {
    audioRef.current = new Audio(`1.mp3`);
    audioRef.current.volume = 0.5; // Set volume to 75%
  }

  // Effect for playing the next track
  useEffect(() => {
    const audio = audioRef.current;

    const playNextTrack = () => {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % 4);
    };

    audio.addEventListener('ended', playNextTrack);

    return () => {
      audio.removeEventListener('ended', playNextTrack);
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

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <button onClick={toggleMusic}>
      {isPlaying ? 'Pause Music' : 'Play Music'}
    </button>
  );
};

export default MusicPlayer;
