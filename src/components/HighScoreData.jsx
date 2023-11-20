import React, { useState } from "react";

const HighScoreData = ({ allTimeData, weeklyData, selectedOption }) => {
  const [showHighScoreData, setShowHighScoreData] = useState(true);

  let sortedAllTimeData = [];
  let sortedWeeklyData = [];
  let firstColumnData = [];
  let secondColumnData = [];

  if (Array.isArray(allTimeData)) {
    sortedAllTimeData = allTimeData
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 20);
  }

  if (Array.isArray(weeklyData)) {
    
    sortedWeeklyData = weeklyData
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 20);
  }

  if (selectedOption === "ALL TIME") {
    firstColumnData = sortedAllTimeData.slice(0, 10);
    secondColumnData = sortedAllTimeData.slice(10, 20);
  } else if (selectedOption === "WEEKLY") {
    firstColumnData = sortedWeeklyData.slice(0, 10);
    secondColumnData = sortedWeeklyData.slice(10, 20);
    
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
    </>
  );
};

export default HighScoreData;
