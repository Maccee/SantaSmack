import { useState } from "react";
import HighScoreData from "./HighScoreData";
import logoImg from "../assets/santa_smack_logo.png";
import highscorenappi from "../assets/highscore_nappi.png";
import measureImg from "../assets/measure.png";
import MusicPlayer from "./MusicPlayer";
import Settings from "./Settings";
import QuestionMarkPopup from "./QuestionMarkPopup";
import QuestionMarkImg from "../assets/questionmark.png";

const Navbar = ({
  allTimeData,
  weeklyData,
  mute,
  setMute,
  highScore,
  gameSpeed,
  setGameSpeed,
  dailyChallengeDistance,
  dailyChallengeData,
}) => {
  const [highScoreOpen, setHighScoreOpen] = useState(false);
  const [showQuestionMarkPopup, setShowQuestionMarkPopup] = useState(false);
  const [selectedhighscoreOption, setSelectedhighscoreOption] =
    useState("ALL TIME");
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
                  <div className="dailyChallengeContainer">
                    <div className="dailyChallenge">
                      <h2>
                        DAILY CHALLENGE{" "}
                        <button
                          className="questionMarkButton"
                          onClick={() =>
                            setShowQuestionMarkPopup((prev) => !prev)
                          }
                        >
                          <img src={QuestionMarkImg} alt="question mark" />
                        </button>
                      </h2>
                      {showQuestionMarkPopup && <QuestionMarkPopup setShowQuestionMarkPopup={setShowQuestionMarkPopup} />}
                      <div className="dailyChallengeDistance">
                        CLOSEST TO <br />
                        <span>{dailyChallengeDistance} M</span>
                      </div>
                    </div>
                    <div className="dailyChallengeTop5">
                      <h2>DAILY CHALLENGE TOP5</h2>
                      <ul>
                        {dailyChallengeData.map((entry, index) => {
                          // Calculate the difference from the dailyChallengeDistance
                          const difference = entry.distance - dailyChallengeDistance;

                          // Determine the sign to display based on whether the distance is over or under
                          const sign = difference > 0 ? "+" : "-";

                          return (
                            <li key={index}>
                              {index + 1}. {entry.name}{" "}
                              <span
                                className={`${index < 3 ? `top${index + 1}` : ""} dist`}
                              >
                                {sign}{Math.abs(difference).toFixed(2)} M
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  <div className="highScoreData">
                    <h2>
                      HIGHSCORES{" "}
                      <button
                        className={`highscoreOptionButton ${selectedhighscoreOption === "ALL TIME"
                          ? "selected"
                          : ""
                          }`}
                        onClick={() => setSelectedhighscoreOption("ALL TIME")}
                      >
                        ALL TIME
                      </button>
                      {" / "}
                      <button
                        className={`highscoreOptionButton ${selectedhighscoreOption === "WEEKLY" ? "selected" : ""
                          }`}
                        onClick={() => setSelectedhighscoreOption("WEEKLY")}
                      >
                        WEEKLY
                      </button>
                    </h2>

                    <HighScoreData
                      allTimeData={allTimeData}
                      weeklyData={weeklyData}
                      selectedOption={selectedhighscoreOption}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="highScoreButtonContainer">

          {allTimeData &&

            <button className="highScoreButton" onClick={handleButtonClick}>
              <img src={highscorenappi} alt="High Score Button" />
            </button>
          }
        </div>
      </div>
    </>
  );
};
export default Navbar;
