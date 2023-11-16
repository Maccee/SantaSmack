import React, { useState } from "react";
import TrophyArrowImg from "../assets/trophy_outer-arrow.svg";
import TrophyImg from "../assets/trophy_inner.svg";

const HighScoreData = ({ highScoreData }) => {
  const [showHighScoreData, setShowHighScoreData] = useState(false);
  const [highScoreOpen, setHighScoreOpen] = useState(false);
  let sortedData = [];
  let firstColumnData = [];
  let secondColumnData = [];

  const handleButtonPress = () => {
    setHighScoreOpen((prev) => !prev);
    setShowHighScoreData((prev) => !prev);
  };

  if (Array.isArray(highScoreData)) {
    sortedData = highScoreData
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 20);
    firstColumnData = sortedData.slice(0, 10);
    secondColumnData = sortedData.slice(10, 20);
  } else {
    return null;
  }

  return (
    <>
      <button className="scores-button" onClick={() => handleButtonPress()}>
        <img src={TrophyImg} />
      </button>
      
      {showHighScoreData && (
        <div className="highscorewindow-table">
          <div>
            {firstColumnData.map((item, index) => (
              <p key={index}>
                {index + 1}. {item.name}{" "}
                <span className={`${index < 3 ? `top${index + 1}` : ""} dist`}>
                  {item.distance}
                </span>
              </p>
            ))}
          </div>
          <div>
            {secondColumnData.map((item, index) => (
              <p key={index + 10}>
                {index + 11}. {item.name}{" "}
                <span className="dist">{item.distance}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
export default HighScoreData;
