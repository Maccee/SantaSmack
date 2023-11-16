import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import { postDataToAzureFunction, getDataFromAzureFunction } from "./ApiUtils";
import { calculateHitStrength, defineHitStrength, resetGame } from "./Utils";
import { distanceMusicPlay } from "./SoundUtils";
import {
  useWindowEventHandlers,
  useGameInitialization,
} from "./Utilities/eventHandlers";
import navbarImg from "./assets/navbar-bg.png";

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
import Navbar from "./components/Navbar";

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
      <Navbar highScoreData={highScoreData} />

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
