import React, { useState } from "react";
import GameSpeed from "./GameSpeed";

const Settings = ({ gameSpeed, setGameSpeed }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="settingsContainer">
        SETTINGS CONTAINER
        <button
          className="settings-button"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          Settings
        </button>
        {showSettings && (
          <GameSpeed gameSpeed={gameSpeed} setGameSpeed={setGameSpeed} />
        )}
      </div>
    </>
  );
};

export default Settings;
