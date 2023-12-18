import React, { useState } from "react";

const InputName = ({ setPlayerName }) => {
  const [name, setName] = useState("");
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
        <form onSubmit={handleButtonClick}>
          <label htmlFor="nameInput" style={labelStyle}>
            What's your name?
          </label><br/>
          <input
            className="inputField"
            id="nameInput"
            placeholder=""
            value={name}
            onChange={handleInputChange}
            autocomplete="off"
          /><br/><br/>
          <button
            type="submit"
            className="inputButton"
            disabled={name.length >= 15 || name === ""}
          >
            LET'S SMACK
          </button>
        </form>
      </div>
    </>
  );
};

export default InputName;
