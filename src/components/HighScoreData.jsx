const HighScoreData = ({ highScoreData, showHighScoreData }) => {
  if (!showHighScoreData) {
    return null;
  }

  const firstColumnData = highScoreData.slice(0, 10);
  const secondColumnData = highScoreData.slice(10, 20);

  return (
    <div className="highscorewindow">
      <h1>HIGHSCORES</h1>
      <div className="highscorewindow-table">
        <div>
          {firstColumnData.map((item, index) => (
            <p key={index}>
              {index + 1}. {item.name} {item.distance}
            </p>
          ))}
        </div>
        <div>
          {secondColumnData.map((item, index) => (
            <p key={index + 10}>
              {index + 11}. {item.name} {item.distance}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HighScoreData;
