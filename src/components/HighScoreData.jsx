const HighScoreData = ({ highScoreData, showHighScoreData }) => {
  if (!showHighScoreData) {
    return null;
  }

  const firstColumnData = highScoreData.slice(0, 10);
  const secondColumnData = highScoreData.slice(10, 20);

  return (
    <div className="highscorewindow">
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
    </div>
  );
};
export default HighScoreData;
