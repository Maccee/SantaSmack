import React, { useState } from "react";
import GameSpeed from "./GameSpeed";
import settingsIcon from "../assets/settings.png";

const Settings = ({ gameSpeed, setGameSpeed }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="settingsContainer">
        <button
          className="settings-button"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          <img src={settingsIcon}></img>
        </button>
        {showSettings && (
          <div>
            <GameSpeed gameSpeed={gameSpeed} setGameSpeed={setGameSpeed} />
          </div>
        )}
      </div>
    </>
  );
};

export default Settings;
