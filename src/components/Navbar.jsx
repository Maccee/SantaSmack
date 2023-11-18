import { useState } from "react";
import HighScoreData from "./HighScoreData";
import logoImg from "../assets/santa_smack_logo.png";
import highscorenappi from "../assets/highscore_nappi.png";
import measureImg from "../assets/measure.png";
import MusicPlayer from "./MusicPlayer";
import Settings from "./Settings";

const Navbar = ({
  highScoreData,
  mute,
  setMute,
  highScore,
  gameSpeed,
  setGameSpeed,
  dailyChallengeDistance,
  dailyChallengeData,
}) => {
  const [highScoreOpen, setHighScoreOpen] = useState(false);
  const handleButtonClick = () => {
    setHighScoreOpen((prev) => !prev);
  };
  return (
    <>
      <div className="navbarOuter">
        <div className="navbar valotausta">
          <div className="navbarContent">
            <div className="navbarTop">
              <div className="navbarLeft">
                {" "}
                <img src={measureImg}></img>
                <div className="sessionLongest">
                  <p>
                    SESSION
                    <br />
                    LONGEST
                  </p>
                  <p className="sesDist">{highScore} M</p>
                </div>
              </div>
              <div className="navbarCenter">
                <img src={logoImg}></img>
              </div>
              <div className="navbarRight">
                <Settings gameSpeed={gameSpeed} setGameSpeed={setGameSpeed} />
                <MusicPlayer mute={mute} setMute={setMute} />
              </div>
            </div>
            {highScoreOpen && (
              <>
                <div className="highScoreBox">
                  <div className="dailyChallenge">
                    DAILY CHALLENGE
                    <br />
                    {dailyChallengeDistance} M <br />
                    {dailyChallengeData[0].name} with{" "}
                    {dailyChallengeData[0].distance} M
                  </div>
                  <div className="highScoreData">
                    <HighScoreData highScoreData={highScoreData} />
                  </div>
                  <div className="dailyChallengeTop5">
                    <h2>DAILY CHALLENGE TOP5</h2>
                    <ul>
                      {dailyChallengeData.map((entry, index) => (
                        <li key={index}>
                          {entry.name}: {entry.distance} M
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="highScoreButtonContainer">
          <button className="highScoreButton" onClick={handleButtonClick}>
            <img src={highscorenappi} alt="High Score Button" />
          </button>
        </div>
      </div>
      
      
    </>
  );
};
export default Navbar;
