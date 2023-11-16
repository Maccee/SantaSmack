import React, { useState } from "react";
import GameSpeed from "./GameSpeed";
import settingsImg from "../assets/Juha.png";

const Settings = ({ gameSpeed, setGameSpeed }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="settingsContainer">
        <button
          className="settings-button"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          <img src={settingsImg}></img>
        </button>
        {showSettings && (
          <GameSpeed gameSpeed={gameSpeed} setGameSpeed={setGameSpeed} />
        )}
      </div>
    </>
  );
};

export default Settings;
