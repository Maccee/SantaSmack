import React, { useState } from "react";

const InputName = ({ setPlayerName }) => {
  const [name, setName] = useState(""); // Initialize with an empty string
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (event) => {
    setName(event.target.value);
    setIsValid(event.target.checkValidity());
  };

  const handleButtonClick = () => {
    if (!name || name.length >= 15 || !isValid) {
      return;
    } else {
      setPlayerName(name);
      localStorage.setItem("playerName", name);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleButtonClick();
    }
  };

  const inputStyle = {
    top: "300px",
    flexDirection: "column",
    width: "300px",
  };

  const labelStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <>
      <div className="inputname highscorewindow-table" style={inputStyle}>
        <label htmlFor="nameInput" style={labelStyle}>
          What's your name?
        </label>
        <input
          className="inputField"
          id="nameInput"
          placeholder=""
          value={name}
          onChange={handleInputChange}
        />
        <button
          className="inputButton"
          onClick={handleButtonClick}
          onKeyDown={handleKeyDown}
          disabled={name.length >= 15 || name === ""}
        >
          LET'S SMACK
        </button>
      </div>
    </>
  );
};

export default InputName;
