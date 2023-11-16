import { useState } from "react";
import HighScoreData from "./HighScoreData";
import logoImg from "../assets/SANTA_SMACK.png";
import highscorenappi from "../assets/highscore_nappi.png";
import targetImg from "../assets/target.png";

const Navbar = ({ highScoreData }) => {
  const [highScoreOpen, setHighScoreOpen] = useState(true);
  const handleButtonClick = () => {
    setHighScoreOpen((prev) => !prev);
  };
  return (
    <>
      <div className="navbar">
        <div className="navbarContent">
          <div className="navbarTop">
            <div className="navbarLeft">
              {" "}
              <img src={targetImg}></img>
            </div>
            <div className="navbarCenter">
              <img src={logoImg}></img>
            </div>
            <div className="navbarRight">RIGHT</div>
          </div>
          {highScoreOpen && (
            <>
              <div className="highScoreBox">
                <p>DAILY CHALLENGE</p>
                <HighScoreData highScoreData={highScoreData} />
                <p>DAILY CHALLENGE TOP5</p>
              </div>
            </>
          )}
        </div>

        <div className="highScoreButtonContainer">
            <button className="highScoreButton" onClick={() => handleButtonClick()}>
              <img src={highscorenappi}></img>
            </button>
        </div>
      </div>
    </>
  );
};
export default Navbar;
