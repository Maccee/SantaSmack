import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import { postDataToAzureFunction, getDataFromAzureFunction } from "./ApiUtils";

// Component Imports
import Santa from "./components/Santa";
import Bat from "./components/Bat";
import Markers from "./components/Markers";
import Ball from "./components/Ball";
import HighScoreData from "./components/HighScoreData";
import HUD from "./components/HUD";
import Background from "./components/Background";

// APP COMPONENT
const App = () => {
  // Define game area width, height and ground level
  const gameAreaWidth = 116000; // in px
  const [gameAreaHeight, setGameAreaHeight] = useState(window.innerHeight); // Client browser window height
  const bottomLimit = gameAreaHeight - 70; // 70px from bottom

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
  const [showHUD, setShowHUD] = useState(true);
  const [lastHitPosition, setLastHitPosition] = useState({ top: 0, left: 0 });
  const [highScore, setHighScore] = useState(0);
  const [distance, setDistance] = useState(0);

  // Hitbox
  const [showHitbox, setShowHitbox] = useState(true); // Toggle visibility
  const [hitboxEntryTime, setHitboxEntryTime] = useState(null); // Time when ball enters hitbox in ms since refresh
  const [hitboxExitTime, setHitboxExitTime] = useState(null); // Time when ball exits hitbox in ms since refresh
  const hitboxTopBoundary = bottomLimit - 200; // Hitbox top
  const hitboxBottomBoundary = bottomLimit - 20; // Hitbox bottom
  const hitboxTransitTime = 250; // The time in ms the ball travels through hitbox

  // Physics
  const [gravity, setGravity] = useState(0.1); // Downward force that pulls ball down while flying
  const airResistance = 0.001; // Resistance to slow the ball in the air
  const bounce = 0.5; // 50% bounce strength
  const [isAtRest, setIsAtRest] = useState(false);

  // For hitStrength calculations
  const [hitStrength, setHitStrength] = useState(0);
  const [mouseDownTime, setMouseDownTime] = useState(0); // The performance.now time when mouse is pressed down
  // Define your minimum and maximum reaction times
  const minReactionTime = 20; // fastest expected reaction time
  const maxReactionTime = 100; // slowest expected reaction time
  // Define your minimum and maximum hit strengths
  const minHitStrength = 15;
  const maxHitStrength = 45;

  // Name
  const [name, setName] = useState("Makke");
  const [highScoreData, setHighScoreData] = useState({});
  const [showHighScoreData, setShowHighScoreData] = useState(false);

  // SCROLLING
  const gameAreaRef = useRef(null); // Game area reference for scrolling
  const [scrollLeft, setScrollLeft] = useState(0); // Scroll position

  useEffect(() => {
    if (gameAreaRef.current) {
      const element = gameAreaRef.current;
      element.scrollTop = element.scrollHeight - element.clientHeight;
    }
    // GET HIGHSCOREDATA ON REFRESH AND PAGE LOAD
    getDataFromAzureFunction().then((sortedResult) => {
      setHighScoreData(sortedResult);
    });
  }, []);

  // Event listener if screen height changes during playing
  useEffect(() => {
    const handleResize = () => {
      setGameAreaHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // TOGGLE HUD
  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log(event.key, event.keyCode);
      if (event.keyCode === 220 || event.keyCode === 192) {
        toggleHUD();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    if (parseFloat(distance) > parseFloat(highScore)) {
      setHighScore(distance);
    }
  }, [distance]);

  // MAIN BALL MOVEMENT AND FLIGHT PHYSICS
  useEffect(() => {
    let animationFrameId;
    const updatePosition = () => {
      // Update velocities
      verticalVelocityRef.current += gravity; // gravity should pull the ball down, so it should be added to the velocity
      horizontalVelocityRef.current *= 1 - airResistance; // air resistance should slow the ball down, so it's subtracted

      // Update position
      let newTop = ballPositionRef.current.top + verticalVelocityRef.current;
      let newLeft =
        ballPositionRef.current.left + horizontalVelocityRef.current;

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
      setScrollLeft((prevScrollLeft) => {
        const newScrollLeft = newLeft - window.innerWidth / 5; // Ball position while scrolling
        return Math.max(
          0,
          Math.min(newScrollLeft, gameAreaWidth - window.innerWidth)
        );
      });

      if (horizontalVelocityRef.current > 0) {
        setDistance((ballPositionRef.current.left / 100).toFixed(2));
      }

      // Update position state
      setBallPosition({ top: newTop, left: newLeft });

      // Update refs
      ballPositionRef.current = { top: newTop, left: newLeft };
      // Request next frame
      animationFrameId = requestAnimationFrame(updatePosition);
    };
    animationFrameId = requestAnimationFrame(updatePosition);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Get performance time in ms when user press mouseDOWN
  const handleMouseDown = () => {
    setMouseDownTime(performance.now());
    //console.log("mousedown", mouseDownTime);
  };
  const handleMouseUp = () => {
    setIsHit(true);
    if (isHit) {
      resetGame();
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

      const hitStrengthValue = calculateHitStrength(reactionTime);
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
      setLastHitPosition({ top: ballPosition.top, left: ballPosition.left });
      setHitAngle(angle);
    }
    
  };

  // Calculate hit strength based on reaction time. ChatGPT at its best.
  const calculateHitStrength = (reactionTime) => {
    // Clamp reaction time within the expected range for safety. I think ~20ms is the fastest i have got.
    const clampedReactionTime = Math.min(
      Math.max(reactionTime, minReactionTime),
      maxReactionTime
    );
    // Invert the reaction time to get the hit strength such that a lower reaction time gives a higher hit strength
    const normalizedTime =
      (clampedReactionTime - minReactionTime) /
      (maxReactionTime - minReactionTime);
    const hitStrength =
      maxHitStrength - normalizedTime * (maxHitStrength - minHitStrength);
    //console.log("Reactiontime", reactionTime, "Hitstrenght", hitStrength);
    return hitStrength;
  };

  // New swing actually. Reset to initial positions and states.
  const resetGame = () => {
    const resetTop = bottomLimit - 250;
    const resetLeft = 100;

    setHitAngle(0); // Reset hit angle
    setIsHit(false); // Reset hit status
    setLastHitPosition({ top: 0, left: 0 }); // Reset the last hit position
    setScrollLeft(0); // Reset scroll position
    setIsSpinning(false); // No spinning anymore
    setHitboxEntryTime(null); // reset the hitbox entry times
    setHitboxExitTime(null);
    setDistance(1);
    setBallPosition({
      top: resetTop,
      left: resetLeft,
    });
    ballPositionRef.current = {
      top: resetTop,
      left: resetLeft,
    };
    verticalVelocityRef.current = -7;
    horizontalVelocityRef.current = 0;
  };

  // Hitbox toggle function
  const toggleShowHitbox = () => {
    setShowHitbox((prevShowHitbox) => !prevShowHitbox);
  };

  // Toggle HUD
  const toggleHUD = () => {
    setShowHUD((prevShowHUD) => !prevShowHUD);
  };

  // APP RENDER
  return (
    <>
      <HighScoreData
        highScoreData={highScoreData}
        showHighScoreData={showHighScoreData}
      />
      <div className="highScoreContainer">
        <button onClick={() => setShowHighScoreData((prev) => !prev)}>
          Toggle Highscore
        </button>
        <p>Your Distance: {highScore}m</p>
      </div>
      {/* HUD (Heads-Up Display) for displaying game stats and controls */}
      <HUD
        showHUD={showHUD}
        lastHitPosition={lastHitPosition}
        ballPosition={ballPosition}
        hitAngle={hitAngle}
        horizontalVelocity={horizontalVelocity}
        verticalVelocity={verticalVelocity}
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
