import { useState } from "react";
import HighScoreData from "./HighScoreData";
import logoImg from "../assets/santa_smack_logo.png";
import highscorenappi from "../assets/highscore_nappi.png";
import measureImg from "../assets/measure.png";
import MusicPlayer from "./MusicPlayer";
import Settings from "./Settings";

const Navbar = ({ highScoreData }) => {
  const [highScoreOpen, setHighScoreOpen] = useState(false);
  const handleButtonClick = () => {
    setHighScoreOpen((prev) => !prev);
  };
  return (
    <>
      <div className="highScoreButtonContainer">
        <button
          className="highScoreButton"
          style={{
            transform: highScoreOpen
              ? "translate(-50%, 405%)"
              : "translate(-50%, 85%)",
          }}
          onClick={handleButtonClick}
        >
          <img src={highscorenappi} alt="High Score Button" />
        </button>{" "}
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
                    <p className="sesDist">1999.99 M</p>
                  </div>
                </div>
                <div className="navbarCenter">
                  <img src={logoImg}></img>
                </div>
                <div className="navbarRight">
                  <Settings />
                  <MusicPlayer />
                </div>
              </div>
              {highScoreOpen && (
                <>
                  <div className="highScoreBox">
                    <div className="dailyChallenge">DAILY CHALLENGE</div>
                    <div className="highScoreData">
                      <HighScoreData highScoreData={highScoreData} />
                    </div>
                    <div className="dailyChallengeTop5">
                      DAILY CHALLENGE TOP5
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Navbar;
