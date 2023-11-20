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
        max="4"
        step="0.1"
        value={gameSpeed}
        onChange={handleSpeedChange}
      />
      x {Number(gameSpeed).toFixed(1)}
    </div>
  );
};

export default GameSpeed;
