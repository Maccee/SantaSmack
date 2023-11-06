const HighScoreData = ({ highScoreData, showHighScoreData }) => {
  if (!showHighScoreData) {
    return null;
  }

  return (
    <div className="highscorewindow">
      {highScoreData ? (
        highScoreData.map((item, index) => (
          <div key={index}>
            <p>Distance: {item.distance}</p>
          </div>
        ))
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default HighScoreData;
