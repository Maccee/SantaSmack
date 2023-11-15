const HighScoreData = ({
  highScoreData,
  showHighScoreData,
  dailyChallengeDistance,
  dailyChallengeName,
}) => {
  if (!showHighScoreData) {
    return null;
  }
  const sortedData = highScoreData.sort((a, b) => b.distance - a.distance).slice(0, 20);
  const firstColumnData = sortedData.slice(0, 10);
  const secondColumnData = sortedData.slice(10, 20);

  return (
    <div className="highscorewindow">
      <div className="highscorewindow-table">
        Daily Challenge: <br /> {dailyChallengeDistance}m <br /><br />{" "}
        {dailyChallengeName.name} with {dailyChallengeName.distance}
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
    </div>
  );
};
export default HighScoreData;
