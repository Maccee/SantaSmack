import React, { useState } from "react";
import TrophyArrowImg from "../assets/trophy_outer-arrow.svg";
import TrophyImg from "../assets/trophy_inner.svg";

const HighScoreData = ({ allTimeData, selectedOption }) => {
  const [showHighScoreData, setShowHighScoreData] = useState(true);

  let sortedData = [];
  let firstColumnData = [];
  let secondColumnData = [];

  if (Array.isArray(allTimeData)) {
    sortedData = allTimeData
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 20);
    firstColumnData = sortedData.slice(0, 10);
    secondColumnData = sortedData.slice(10, 20);
  } else {
    return null;
  }

  return (
    <>
      {showHighScoreData && selectedOption === "ALL TIME" && (
        <div className="highscorewindow-table">
          <div>
            {firstColumnData.map((item, index) => (
              <p key={index}>
                {index + 1}. {item.name}{" "}
                <span className={`${index < 3 ? `top${index + 1}` : ""} dist`}>
                  {item.distance} M
                </span>
              </p>
            ))}
          </div>
          <div>
            {secondColumnData.map((item, index) => (
              <p key={index + 10}>
                {index + 11}. {item.name}{" "}
                <span className="dist">{item.distance} M</span>
              </p>
            ))}
          </div>
        </div>
      )}
      {showHighScoreData && selectedOption === "WEEKLY" && (
        <div className="highscorewindow-table">
          <div>
            {firstColumnData.map((item, index) => (
              <p key={index}>
                {index + 1}. {item.name}{" "}
                <span className={`${index < 3 ? `top${index + 1}` : ""} dist`}>
                  {item.distance} W
                </span>
              </p>
            ))}
          </div>
          <div>
            {secondColumnData.map((item, index) => (
              <p key={index + 10}>
                {index + 11}. {item.name}{" "}
                <span className="dist">{item.distance} W</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default HighScoreData;
