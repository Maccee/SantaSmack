import React from "react";

const MusicVolume = ({ setMusicVolume, musicVolume }) => {
    
  const handleVolumeChange = (event) => {
    setMusicVolume(event.target.value);
  };

  return (
    <div className="game-speed">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={musicVolume}
        onChange={handleVolumeChange}
      />
      {`${(musicVolume * 100).toFixed(0)}%`}
    </div>
  );
};

export default MusicVolume;
