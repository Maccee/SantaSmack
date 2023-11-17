import React, { useState } from "react";

const InputName = ({ setPlayerName }) => {
  const [name, setName] = useState(null);

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleButtonClick = () => {
    if (name.length >= 15) {
      return;
    }
    if (name === "") {
      return;
    } else {
      setPlayerName(name);
      localStorage.setItem('playerName', name);
    }
  };

  const inputStyle = {
    top: "300px",
    flexDirection: "column",
    width: "300px" // Corrected property name
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
          ANNAPPA NIMESI
        </label>
        <input
          className="inputField"
          id="nameInput"
          placeholder="nimi.."
          value={name}
          onChange={handleInputChange}
        />
        <button className="inputButton" onClick={handleButtonClick}>
          Submit
        </button>
      </div>
    </>
  );
};

export default InputName;
