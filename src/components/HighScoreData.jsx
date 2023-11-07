const HighScoreData = ({ highScoreData, showHighScoreData }) => {
  if (!showHighScoreData) {
    return null;
  }

  return (
    <div className="highscorewindow">
      HIGHSCORES
      <br/><br/>
      
      {highScoreData ? (
        highScoreData.map((item, index) => (
          <div key={index}>
            <p>{item.name} {item.distance}</p>
            
          </div>
        ))
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default HighScoreData;
