import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import { postDataToAzureFunction, getDataFromAzureFunction } from "./ApiUtils";
import { calculateHitStrength, defineHitStrength, resetGame } from "./Utils";
import { distanceMusicPlay } from "./SoundUtils";
import {
  useWindowEventHandlers,
  useGameInitialization,
} from "./Utilities/eventHandlers";

// Component Imports
import Santa from "./components/Santa";
import Markers from "./components/Markers";
import Ball from "./components/Ball";
import HighScoreData from "./components/HighScoreData";
import HUD from "./components/HUD";
import Background from "./components/Background";
import MusicPlayer from "./components/MusicPlayer";
import Ground from "./components/Ground";
import Porot from "./components/Porot";
import Hype from "./components/Hype";
import InputName from "./components/InputName";
import Settings from "./components/Settings";
import TargetImg from "./assets/target.png";

// APP COMPONENT
const App = () => {
  // HAS SET PLAYER NAME
  const [playerName, setPlayerName] = useState(null);

  // Define game area width, height and ground level
  const [gameAreaWidth, setGameAreaWidth] = useState(10000); // in px
  const [gameAreaHeight, setGameAreaHeight] = useState(window.innerHeight); // Client browser window height
  const [bottomLimit, setBottomLimit] = useState(gameAreaHeight - 50);

  // BALL MOVEMENT
  // Ball position, start position set 250px from bottom and 100px from left
  const [ballPosition, setBallPosition] = useState({
    top: bottomLimit - 250,
    left: 100,
  });
  const [verticalVelocity, setVerticalVelocity] = useState(-7); // Ball vertical speed, set to -7 for upward movement before swing
  const [horizontalVelocity, setHorizontalVelocity] = useState(0); // Ball horizontal speed
  const [hitAngle, setHitAngle] = useState(0); // Hit angle calculated between -90 and 90 deg.
  const [isHit, setIsHit] = useState(false); // Check if swinged
  const [isSpinning, setIsSpinning] = useState(false); // Ball spinning after swing

  const verticalVelocityRef = useRef(verticalVelocity);
  const horizontalVelocityRef = useRef(horizontalVelocity);
  const ballPositionRef = useRef(ballPosition);

  // Debug console
  const [showHUD, setShowHUD] = useState(false);
  const [lastHitPosition, setLastHitPosition] = useState({ top: 0, left: 0 });
  const [highScore, setHighScore] = useState(0);
  const [distance, setDistance] = useState(0);

  // Hitbox
  const [showHitbox, setShowHitbox] = useState(false); // Toggle hitbox visibility
  const [hitboxEntryTime, setHitboxEntryTime] = useState(null); // Time when ball enters hitbox in ms since refresh
  const [hitboxExitTime, setHitboxExitTime] = useState(null); // Time when ball exits hitbox in ms since refresh
  const hitboxTopBoundary = bottomLimit - 160; // Hitbox top
  const hitboxBottomBoundary = bottomLimit + 40; // Hitbox bottom
  const hitboxTransitTime = 152; // The time in ms the ball travels through hitbox

  // Physics
  const gravity = 0.1; // Downward force that pulls ball down while flying
  const airResistance = 0.001; // Resistance to slow the ball in the air
  const bounce = 0.5; // 50% bounce strength
  const [gameSpeed, setGameSpeed] = useState(1);

  // For hitStrength calculations
  const [hitStrength, setHitStrength] = useState(0);
  const [mouseDownTime, setMouseDownTime] = useState(0); // The performance.now time when mouse is pressed down

  // MUSAT
  const [mute, setMute] = useState(true);

  // COLLISION
  const [poros, setPoros] = useState([]);
  const ballDiameter = 50;
  const poroWidth = 150;
  const poroHeight = 250;
  const hitPorosRef = useRef(new Set()); // Ref to keep track of hit poros
  const [poroHits, setPoroHits] = useState(0);
  const [consecutivePoroHits, setConsecutivePoroHits] = useState(0);
  const [poroHitCounter, setPoroHitCounter] = useState(0);

  // HIGHSCORE
  const [highScoreData, setHighScoreData] = useState({});

  const dailyChallengeDistance = 50;
  const [dailyChallengeName, setDailyChallengeName] = useState(null);

  // SCROLLING
  const gameAreaRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  //Koodit
  const [juhaMode, setJuhaMode] = useState(false);

  // TOGGLE HUD
  const toggleHUD = () => {
    setShowHUD((prevShowHUD) => !prevShowHUD);
  };

  // Eventhandlers for keydown and get Highscore
  useGameInitialization(
    setJuhaMode,
    toggleHUD,
    gameAreaRef,
    getDataFromAzureFunction,
    setHighScoreData,
    dailyChallengeDistance,
    setDailyChallengeName,
    dailyChallengeName
  );
  // Check screen resize to prevent possible cheating
  useWindowEventHandlers(horizontalVelocityRef);

  // HITBOX
  useEffect(() => {
    if (
      ballPosition.top > hitboxTopBoundary &&
      ballPosition.top < hitboxTopBoundary + 25 &&
      ballPosition.left === 100 &&
      verticalVelocityRef.current > 1
    ) {
      setHitboxEntryTime(performance.now());
      //console.log("enter", performance.now());
    }
    if (
      ballPosition.top > hitboxBottomBoundary - 25 &&
      ballPosition.left === 100 &&
      verticalVelocityRef.current > 0
    ) {
      setHitboxExitTime(performance.now());
      //console.log("exit", performance.now());
    }
  }, [ballPosition.top]);

  // CHECK FOR YOUR DISTANCE OF THE SESSION!
  useEffect(() => {
    const handleNewHighScore = async () => {
      const data = {
        name: playerName,
        hitAngle: hitAngle,
        hitStrength: hitStrength,
        gameAreaHeight: gameAreaHeight,
        distance: distance,
      };
      await postDataToAzureFunction(data);
      const updatedScores = await getDataFromAzureFunction();
      setHighScoreData(updatedScores);
    };

    if (isHit && horizontalVelocityRef.current === 0) {
      if (parseFloat(distance) > parseFloat(highScoreData[19].distance)) {
        let newHighScoresound = new Audio("highscore.mp3");
        if (juhaMode) {
          let audio = new Audio("/iddqd/kuitenkinjoihankohtuu.mp3");
          audio.play();
        } else {
          newHighScoresound.play();
        }
      }
      handleNewHighScore();
    }
  }, [distance, horizontalVelocityRef.current]);

  // LETS PLAY MUSIC WHILE WE ARE IN SPEEEEEED !!
  useEffect(() => {
    distanceMusicPlay(horizontalVelocityRef, mute);
  }, [horizontalVelocityRef.current]);

  // Dynamically generate gamearea
  useEffect(() => {
    const newWidth = ballPositionRef.current.left + 20000;
    if (gameAreaWidth < newWidth) {
      setGameAreaWidth(newWidth);
    }
  }, [ballPositionRef.current.left]);

  // MAIN PHYSICS UPDATE
  let lastTime;

  useEffect(() => {
    let animationFrameId;
    const updatePosition = (time) => {
      if (lastTime !== undefined) {
        const timeDelta = (time - lastTime) / 7;

        // Apply physics
        verticalVelocityRef.current += gravity * timeDelta * gameSpeed; // gravity should be scaled properly
        horizontalVelocityRef.current *= Math.pow(
          1 - airResistance,
          timeDelta * gameSpeed
        );

        // UPDATE
        let newTop =
          ballPositionRef.current.top +
          verticalVelocityRef.current * timeDelta * gameSpeed;
        let newLeft =
          ballPositionRef.current.left +
          horizontalVelocityRef.current * timeDelta * gameSpeed;

        // COLLISION DETECTION FOR POROS
        poros.forEach((poro, index) => {
          const poroRect = {
            left: poro.x,
            right: poro.x + poroWidth,
            top: poro.y,
            bottom: poro.y + poroHeight,
          };
          const ballRect = {
            left: newLeft,
            right: newLeft + ballDiameter,
            top: newTop,
            bottom: newTop + ballDiameter,
          };
          const isInCollision =
            ballRect.right > poroRect.left &&
            ballRect.left < poroRect.right &&
            ballRect.bottom > poroRect.top &&
            ballRect.top < poroRect.bottom;
          if (isInCollision && !hitPorosRef.current.has(index)) {
            setPoroHits(poroHits + 1);
            setPoroHitCounter(poroHitCounter + 1);
            horizontalVelocityRef.current += 5;
            if (verticalVelocityRef.current > 15) {
              verticalVelocityRef.current -= 20;
            } else {
              verticalVelocityRef.current -= 10;
            }
            let poroHitAudio = new Audio("bells.mp3");
            if (juhaMode) {
              poroHitAudio = new Audio("hyvahienohomma.mp3");
            }
            if (!mute) {
              poroHitAudio.play();
            }

            hitPorosRef.current.add(index); // Mark this poro as hit
          } else if (!isInCollision && hitPorosRef.current.has(index)) {
            hitPorosRef.current.delete(index);
          }
        });

        // POMPPU
        if (newTop >= bottomLimit) {
          if (poroHitCounter > consecutivePoroHits) {
            setConsecutivePoroHits(poroHitCounter);
          }
          if (poroHitCounter > 0) {
            setPoroHitCounter(0);
          }

          newTop = bottomLimit;
          verticalVelocityRef.current = -verticalVelocityRef.current * bounce;
          if (Math.abs(verticalVelocityRef.current) < bounce) {
            verticalVelocityRef.current = 0;
          }
          horizontalVelocityRef.current *= 1 - airResistance - 0.05;
        }

        // STOP MOVEMENT
        if (Math.abs(horizontalVelocityRef.current) < 1) {
          horizontalVelocityRef.current = 0;
          setIsSpinning(false);
        }

        // SCROLL
        setScrollLeft(() => {
          const newScrollLeft = newLeft - window.innerWidth / 5; // PIENEMPI ENEMMÄN VASEMMALLE
          return Math.max(
            0,
            Math.min(newScrollLeft, gameAreaWidth - window.innerWidth)
          );
        });

        if (Math.abs(horizontalVelocityRef.current) > 0) {
          const newDistance = parseFloat(
            (ballPositionRef.current.left / 100).toFixed(2)
          );
          setDistance(newDistance);
          setHighScore((prevHighScore) => Math.max(prevHighScore, newDistance));
        }

        // UPDATE BALL POSITION AND REFS
        setBallPosition({ top: newTop, left: newLeft });
        ballPositionRef.current = { top: newTop, left: newLeft };

        // NEXT FRAME
        lastTime = time;
      } else {
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    // GAME LOOP
    animationFrameId = requestAnimationFrame(updatePosition);
    return () => {
      cancelAnimationFrame(animationFrameId);
      lastTime = undefined;
    };
  }, [bottomLimit, poros, isHit, gameSpeed, poroHitCounter]);

  // SET PERFORMANCE TIME
  const handleMouseDown = () => {
    setMouseDownTime(performance.now());
  };
  const handleMouseUp = () => {
    if (playerName === null) {
      return;
    }
    setIsHit(true);
    if (isHit) {
      resetGame(
        setHitAngle,
        setIsHit,
        setLastHitPosition,
        setScrollLeft,
        setIsSpinning,
        setHitboxEntryTime,
        setHitboxExitTime,
        setDistance,
        setBallPosition,
        ballPositionRef,
        verticalVelocityRef,
        horizontalVelocityRef,
        bottomLimit,
        setPoroHitCounter,
        setPoroHits,
        setConsecutivePoroHits
      );
    }

    const mouseUpTime = performance.now();

    if (
      !isHit &&
      mouseUpTime >= hitboxEntryTime &&
      mouseUpTime <= hitboxEntryTime + hitboxTransitTime
    ) {
      setIsHit(true);
      setIsSpinning(true);

      const hitStrengthValue = defineHitStrength(juhaMode);
      setHitStrength(hitStrengthValue);

      const angle =
        90 - ((mouseUpTime - hitboxEntryTime) / hitboxTransitTime) * 120;
      const radians = (angle * Math.PI) / 180;
      const verticalVelocityComponent = hitStrengthValue * Math.sin(radians);
      const horizontalVelocityComponent = hitStrengthValue * Math.cos(radians);

      setVerticalVelocity(-verticalVelocityComponent);
      setHorizontalVelocity(horizontalVelocityComponent);

      verticalVelocityRef.current = -verticalVelocityComponent;
      horizontalVelocityRef.current = horizontalVelocityComponent;

      // FOR HUD ONLY
      setLastHitPosition({ top: ballPosition.top });
      setHitAngle(angle);
    }
  };

  // TOGGLE HITBOX
  const toggleShowHitbox = () => {
    setShowHitbox((prevShowHitbox) => !prevShowHitbox);
  };

  const handleSpaceDown = (event) => {
    if (event.code === "Space" && !event.repeat) {
      event.preventDefault();
      setMouseDownTime(performance.now());
    }
  };
  const handleSpaceUp = (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      handleMouseUp();
    }
  };
  const blurStyle = {
    filter: "blur(5px)", // You can adjust the blur intensity as needed
  };

  // APP RENDER
  return (
    <>
      <div className="navbar">
        <div className="navbar-content">
          <div className="nav-left">
            <img src={TargetImg} alt="Target" />
            <div className="session-high">
              <p>
                SESSION
                <br />
                LONGEST
              </p>{" "}
              <p className="longest-score">{highScore.toFixed(2)} M</p>
            </div>
          </div>
          <div className="nav-center">
            <HighScoreData highScoreData={highScoreData} />
            {playerName === null && <InputName setPlayerName={setPlayerName} />}
          </div>
          <div className="nav-right">
            <Settings gameSpeed={gameSpeed} setGameSpeed={setGameSpeed} />
            <MusicPlayer mute={mute} setMute={setMute} />
          </div>
        </div>
        <svg
          width="650"
          height="179"
          viewBox="0 0 650 179"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_489_15)">
            <path
              d="M35 22.5C28.0964 22.5 22.5 28.0964 22.5 35V95C22.5 101.904 28.0964 107.5 35 107.5H276.94C279.862 107.5 282.5 110.367 282.5 114C282.5 137.472 301.528 156.5 325 156.5C348.472 156.5 367.5 137.472 367.5 114C367.5 110.367 370.138 107.5 373.06 107.5H615C621.904 107.5 627.5 101.904 627.5 95V35C627.5 28.0964 621.904 22.5 615 22.5H35Z"
              stroke="#00A44B"
              stroke-width="5"
              shape-rendering="crispEdges"
            />
          </g>
          <g filter="url(#filter1_f_489_15)">
            <path
              d="M35 20C26.7157 20 20 26.7157 20 35V95C20 103.284 26.7157 110 35 110H276.94C277.603 110 278.295 110.29 278.919 111.017C279.572 111.776 280 112.869 280 114C280 138.853 300.147 159 325 159C349.853 159 370 138.853 370 114C370 112.869 370.428 111.776 371.081 111.017C371.705 110.29 372.397 110 373.06 110H615C623.284 110 630 103.284 630 95V35C630 26.7157 623.284 20 615 20H35Z"
              stroke="#00A44B"
              stroke-width="10"
            />
          </g>
          <g filter="url(#filter2_i_489_15)">
            <path
              d="M35 25C29.4772 25 25 29.4772 25 35V95C25 100.523 29.4771 105 35 105H276.94C281.585 105 285 109.355 285 114C285 136.091 302.909 154 325 154C347.091 154 365 136.091 365 114C365 109.355 368.415 105 373.06 105H615C620.523 105 625 100.523 625 95V35C625 29.4772 620.523 25 615 25H35Z"
              fill="url(#paint0_radial_489_15)"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_489_15"
              x="18"
              y="18"
              width="618"
              height="147"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="2" dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_489_15"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_489_15"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_f_489_15"
              x="0"
              y="0"
              width="650"
              height="179"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="7.5"
                result="effect1_foregroundBlur_489_15"
              />
            </filter>
            <filter
              id="filter2_i_489_15"
              x="25"
              y="25"
              width="604"
              height="133"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="4" dy="4" />
              <feGaussianBlur stdDeviation="15.15" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_489_15"
              />
            </filter>
            <radialGradient
              id="paint0_radial_489_15"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(325 50.6496) rotate(90) scale(43.4334 317.5)"
            >
              <stop offset="0.038414" stop-color="#BD2828" />
              <stop offset="1" stop-color="#870404" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <HUD
        showHUD={showHUD}
        lastHitPosition={lastHitPosition}
        ballPosition={ballPosition}
        hitAngle={hitAngle}
        horizontalVelocity={horizontalVelocity}
        horizontalVelocityRef={horizontalVelocityRef}
        verticalVelocity={verticalVelocity}
        verticalVelocityRef={verticalVelocityRef}
        distance={distance}
        bottomLimit={bottomLimit}
        isHit={isHit}
        highScore={highScore}
        hitStrength={hitStrength}
        toggleShowHitbox={toggleShowHitbox}
        gameAreaHeight={gameAreaHeight}
        poroHits={poroHits}
        consecutivePoroHits={consecutivePoroHits}
        poroHitCounter={poroHitCounter}
      />

      {highScoreData[19] &&
        highScoreData.length >= 20 &&
        parseFloat(distance) > parseFloat(highScoreData[19].distance) && (
          <Hype />
        )}

      <div
        className="game-area"
        tabIndex={0}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onKeyDown={handleSpaceDown}
        onKeyUp={handleSpaceUp}
        style={playerName === null ? blurStyle : {}}
      >
        <Background scrollLeft={scrollLeft} gameAreaWidth={gameAreaWidth} />

        <div
          className="scroll-container"
          style={{ transform: `translateX(-${scrollLeft}px)` }}
        >
          <Markers
            gameAreaWidth={gameAreaWidth}
            gameAreaHeight={gameAreaHeight}
          />
          <Porot
            setPoros={setPoros}
            gameAreaWidth={gameAreaWidth}
            gameAreaHeight={gameAreaHeight}
            ballPositionRef={ballPositionRef}
          />

          <Santa
            showHitbox={showHitbox}
            hitboxTopBoundary={hitboxTopBoundary}
            hitboxBottomBoundary={hitboxBottomBoundary}
            bottomLimit={bottomLimit}
            isHit={isHit}
            gameAreaHeight={gameAreaHeight}
            playerName={playerName}
          />

          <Ball
            top={ballPosition.top}
            left={ballPosition.left}
            isSpinning={isSpinning}
            distance={distance}
            isHit={isHit}
            verticalVelocityRef={verticalVelocityRef}
          />

          <Ground
            gameAreaHeight={gameAreaHeight}
            gameAreaWidth={gameAreaWidth}
          />
        </div>
      </div>
    </>
  );
};

export default App;
