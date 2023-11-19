import React, { useState } from "react";

const InputName = ({ setPlayerName }) => {
  const [name, setName] = useState(null);

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleButtonClick = () => {
    if (name.length >= 15 || name === "") {
      return;
    } else {
      setPlayerName(name);
      localStorage.setItem("playerName", name);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents the default behavior (e.g., form submission)
      handleButtonClick(); // Call your click handler function
    }
  };

  const inputStyle = {
    top: "300px",
    flexDirection: "column",
    width: "300px", // Corrected property name
  };

  const labelStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // Other styling properties if needed
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
        >
          LET'S SMACK
        </button>
      </div>
    </>
  );
};

export default InputName;
