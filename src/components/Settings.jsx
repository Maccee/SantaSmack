import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import GameSpeed from "./GameSpeed";
import settingsIcon from "../assets/settings.png";

const Settings = ({ gameSpeed, setGameSpeed }) => {
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("click", handleClickOutside); // Use click event
    return () => {
      document.removeEventListener("click", handleClickOutside); // Use click event
    };
  }, []);

  return (
    <div className="settingsContainer">
      <button
        ref={buttonRef}
        className="settings-button"
        onClick={(event) => {
          event.stopPropagation(); // Stop event propagation
          setShowSettings((prev) => !prev);
        }}
      >
        <img src={settingsIcon} alt="settings icon" />
      </button>
      {showSettings &&
        ReactDOM.createPortal(
          <div className="settingsPopup" ref={settingsRef}>
            <h2>Settings</h2>
            <div className="setting">
              <p>Game speed</p>
              <GameSpeed gameSpeed={gameSpeed} setGameSpeed={setGameSpeed} />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Settings;
