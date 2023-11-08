import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import { postDataToAzureFunction, getDataFromAzureFunction } from "./ApiUtils";
import { calculateHitStrength, defineHitStrength, resetGame } from "./Utils";

// Component Imports
import Santa from "./components/Santa";
import Bat from "./components/Bat";
import Markers from "./components/Markers";
import Ball from "./components/Ball";
import HighScoreData from "./components/HighScoreData";
import HUD from "./components/HUD";
import Background from "./components/Background";
import MusicPlayer from "./components/MusicPlayer";

// APP COMPONENT
const App = () => {
  // Define game area width, height and ground level
  const gameAreaWidth = 116000; // in px
  const [gameAreaHeight, setGameAreaHeight] = useState(window.innerHeight); // Client browser window height
  const [bottomLimit, setBottomLimit] = useState(gameAreaHeight - 70); // 70px from bottom

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
  const [showHitbox, setShowHitbox] = useState(false); // Toggle visibility
  const [hitboxEntryTime, setHitboxEntryTime] = useState(null); // Time when ball enters hitbox in ms since refresh
  const [hitboxExitTime, setHitboxExitTime] = useState(null); // Time when ball exits hitbox in ms since refresh
  const hitboxTopBoundary = bottomLimit - 200; // Hitbox top
  const hitboxBottomBoundary = bottomLimit - 20; // Hitbox bottom
  const hitboxTransitTime = 250; // The time in ms the ball travels through hitbox

  // Physics
  const [gravity, setGravity] = useState(0.1); // Downward force that pulls ball down while flying
  const airResistance = 0.001; // Resistance to slow the ball in the air
  const bounce = 0.5; // 50% bounce strength

  // For hitStrength calculations
  const [hitStrength, setHitStrength] = useState(0);
  const [mouseDownTime, setMouseDownTime] = useState(0); // The performance.now time when mouse is pressed down
  // Define your minimum and maximum reaction times
  const minReactionTime = 20; // fastest expected reaction time
  const maxReactionTime = 100; // slowest expected reaction time
  // Define your minimum and maximum hit strengths
  const minHitStrength = 25;
  const maxHitStrength = 75;

  // HIGHSCORE

  const [highScoreData, setHighScoreData] = useState({});
  const [showHighScoreData, setShowHighScoreData] = useState(false);

  // SCROLLING
  const gameAreaRef = useRef(null); // Game area reference for scrolling
  const [scrollLeft, setScrollLeft] = useState(0); // Scroll position

  // SET GAMEAREA // TOGGLE HUD // INITALIZATION
  useEffect(() => {
    // Handle key down for HUD toggle
    const handleKeyDown = (event) => {
      //console.log(event.key, event.keyCode);
      if (event.keyCode === 220 || event.keyCode === 192) {
        toggleHUD();
      }
    };
    // Attach keydown event listener
    window.addEventListener("keydown", handleKeyDown);

    // Set game area scroll position and get high score data
    if (gameAreaRef.current) {
      const element = gameAreaRef.current;
      element.scrollTop = element.scrollHeight - element.clientHeight;
      gameAreaRef.current.focus();
    }

    getDataFromAzureFunction().then((sortedResult) => {
      setHighScoreData(sortedResult);
    });
    // Cleanup function to remove event listener
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Event listener if screen height changes during playing
  useEffect(() => {
    const handleResize = () => {
      setGameAreaHeight(window.innerHeight);
      setBottomLimit(gameAreaHeight - 70);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      const name = prompt("Congrats on the high score! Enter your name:");
      if (name) {
        const data = {
          name: name,
          hitAngle: hitAngle, // Assuming hitAngle is available in this scope
          hitStrength: hitStrength, // Same assumption as above
          gameAreaHeight: gameAreaHeight, // Same assumption as above
          distance: distance,
        };
        await postDataToAzureFunction(data);
        // Optionally, you can refresh the highScoreData after posting
        const updatedScores = await getDataFromAzureFunction();
        setHighScoreData(updatedScores);
      }
    };

    if (isHit && horizontalVelocityRef.current === 0) {
      // Check if the distance is greater than the last high score data entry
      if (
        highScoreData.length < 10 ||
        parseFloat(distance) >
          parseFloat(highScoreData[highScoreData.length - 1].distance)
      ) {
        handleNewHighScore();
      }
    }
  }, [distance, horizontalVelocityRef.current]);

  let lastTime;
  // MAIN BALL MOVEMENT AND FLIGHT PHYSICS
  useEffect(() => {
    let animationFrameId;

    // Make sure to accept the 'time' parameter here
    const updatePosition = (time) => {
      if (lastTime !== undefined) {
        const timeDelta = (time - lastTime) / 7; // Convert to seconds

        
        // Apply physics
        verticalVelocityRef.current += gravity * timeDelta; // gravity should be scaled properly
        horizontalVelocityRef.current *= Math.pow(1 - airResistance, timeDelta);

        

        // Update position based on timeDelta
        let newTop =
          ballPositionRef.current.top + verticalVelocityRef.current * timeDelta;
        let newLeft =
          ballPositionRef.current.left +
          horizontalVelocityRef.current * timeDelta;

        // Check for bounce
        if (newTop >= bottomLimit) {
          newTop = bottomLimit;
          verticalVelocityRef.current = -verticalVelocityRef.current * bounce;
          if (Math.abs(verticalVelocityRef.current) < bounce) {
            verticalVelocityRef.current = 0;
          }
          horizontalVelocityRef.current *= 1 - airResistance - 0.1;
        }

        // Check horizontal velocity and stop the ball if below threshold
        if (Math.abs(horizontalVelocityRef.current) < 1) {
          horizontalVelocityRef.current = 0;
          setIsSpinning(false);
        }
        // Scroll
        setScrollLeft(() => {
          const newScrollLeft = newLeft - window.innerWidth / 5; // Ball position while scrolling
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

        // Update position state
        setBallPosition({ top: newTop, left: newLeft });
        // Update refs
        ballPositionRef.current = { top: newTop, left: newLeft };
        // Request next frame
        lastTime = time;
      } else {
        // If lastTime wasn't set, set it to the current time, but don't move the ball yet
        lastTime = time;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };
    animationFrameId = requestAnimationFrame(updatePosition);
    return () => {
      cancelAnimationFrame(animationFrameId);
      lastTime = undefined;
    };
  }, [bottomLimit]);

  // Get performance time in ms when user press mouseDOWN
  const handleMouseDown = () => {
    setMouseDownTime(performance.now());
    //console.log("mousedown", mouseDownTime);
  };
  const handleMouseUp = () => {
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
        bottomLimit
      );
    }
    const mouseUpTime = performance.now();
    const reactionTime = mouseUpTime - mouseDownTime;

    if (
      !isHit &&
      mouseUpTime >= hitboxEntryTime &&
      mouseUpTime <= hitboxEntryTime + hitboxTransitTime
    ) {
      setIsHit(true);
      setIsSpinning(true);

      //const hitStrengthValue = calculateHitStrength(
      //  reactionTime,
      // minReactionTime,
      // maxReactionTime,
      // minHitStrength,
      // maxHitStrength
      //);

      const hitStrengthValue = defineHitStrength();
      setHitStrength(hitStrengthValue);

      const angle =
        90 - ((mouseUpTime - hitboxEntryTime) / hitboxTransitTime) * 180;
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

  // Hitbox toggle function
  const toggleShowHitbox = () => {
    setShowHitbox((prevShowHitbox) => !prevShowHitbox);
  };

  // Toggle HUD
  const toggleHUD = () => {
    setShowHUD((prevShowHUD) => !prevShowHUD);
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

  // APP RENDER
  return (
    <>
      <HighScoreData
        highScoreData={highScoreData}
        showHighScoreData={showHighScoreData}
      />
      <div className="highScoreContainer">
        <MusicPlayer />
        <button onClick={() => setShowHighScoreData((prev) => !prev)}>
          Toggle Highscore
        </button>
        <p>Your Session High: {highScore.toFixed(2)}m</p>
      </div>
      {/* HUD (Heads-Up Display) for displaying game stats and controls */}
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
      />
      <div
        ref={gameAreaRef}
        className="game-area"
        tabIndex={0}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onKeyDown={handleSpaceDown}
        onKeyUp={handleSpaceUp}
      >
        {/* Background layers with parallax scrolling effect */}
        <Background scrollLeft={scrollLeft} />

        {/* Scrollable container for the game elements to allow for a larger virtual play area */}
        <div
          className="scroll-container"
          style={{ transform: `translateX(-${scrollLeft}px)` }}
        >
          {/* Game markers indicating distance and render sign positions */}
          <Markers gameAreaWidth={gameAreaWidth} />

          {/* The Santa component, just Santa. :) Debug hitbox is in this component */}
          <Santa
            showHitbox={showHitbox}
            hitboxTopBoundary={hitboxTopBoundary}
            hitboxBottomBoundary={hitboxBottomBoundary}
            bottomLimit={bottomLimit}
          />

          {/* The Ball component, representing the object being hit in the game */}
          <Ball
            top={ballPosition.top}
            left={ballPosition.left}
            isSpinning={isSpinning}
            distance={distance}
            isHit={isHit}
          />

          {/* The Bat component, controlled by the player to hit the ball */}
          <Bat isHit={isHit} />

          {/* Visual representation of the ground */}
          <div className="ground"></div>
        </div>
      </div>
    </>
  );
};

export default App;
