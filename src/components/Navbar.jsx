import { useState } from "react";
import HighScoreData from "./HighScoreData";
import logoImg from "../assets/SANTA_SMACK.png";
import highscorenappi from "../assets/highscore_nappi.png";
import targetImg from "../assets/target.png";

const Navbar = ({ highScoreData }) => {
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
                <img src={targetImg}></img>
              </div>
              <div className="navbarCenter">
                <div className="highScoreButtonContainer">
                  <button
                    className="highScoreButton"
                    onClick={() => handleButtonClick()}
                  >
                    <img src={logoImg}></img>
                  </button>
                </div>
              </div>
              <div className="navbarRight">RIGHT</div>
            </div>
            {highScoreOpen && (
              <>
                <div className="highScoreBox">
                  <div className="dailyChallenge">DAILY CHALLENGE</div>

                  <div className="highScoreData">
                    <HighScoreData highScoreData={highScoreData} />
                  </div>

                  <div className="dailyChallengeTop5">DAILY CHALLENGE TOP5</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Navbar;
