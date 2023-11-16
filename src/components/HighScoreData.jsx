import React, { useState } from "react";
const HighScoreData = ({ highScoreData }) => {
  const [showHighScoreData, setShowHighScoreData] = useState(false);

  let firstColumnData = [];
  let secondColumnData = [];

  if (Array.isArray(highScoreData)) {
    firstColumnData = highScoreData.slice(0, 10);
    secondColumnData = highScoreData.slice(10, 20);
  } else {
    return null;
  }

  return (
    <div className="highscorewindow">
      <button
        className="scores-button"
        onClick={() => setShowHighScoreData((prev) => !prev)}
      >
        Scores
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
    </div>
  );
};
export default HighScoreData;
