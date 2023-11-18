import React from "react";

const GameSpeed = ({ gameSpeed, setGameSpeed }) => {
  const handleSpeedChange = (event) => {
    setGameSpeed(event.target.value);
    
  };

  return (
    <div className="game-speed">
      <input
        type="range"
        min="0.1"
        max="2"
        step="0.1"
        value={gameSpeed}
        onChange={handleSpeedChange}
      />
    </div>
  );
};

export default GameSpeed;
