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
  const [keyActive, setKeyActive] = useState(false);

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

  // Debug console
  const [showHUD, setShowHUD] = useState(false);
  const [lastHitPosition, setLastHitPosition] = useState({ top: 0, left: 0 });
  const [highScore, setHighScore] = useState(0);
  const [distance, setDistance] = useState(0);

  // Hitbox
  const [showHitbox, setShowHitbox] = useState(false); // Toggle visibility
  const [hitboxEntryTime, setHitboxEntryTime] = useState(null); // Time when ball enters hitbox in ms since refresh
  const [hitboxExitTime, setHitboxExitTime] = useState(null); // Time when ball exits hitbox in ms since refresh
  const hitboxTopBoundary = bottomLimit - 180; // Hitbox top
  const hitboxBottomBoundary = bottomLimit + 0; // Hitbox bottom
  const hitboxTransitTime = 250; // The time in ms the ball travels through hitbox

  // Physics
  const [gravity, setGravity] = useState(0.1); // Downward force that pulls ball down while flying
  const airResistance = 0.9999; // Resistance to slow the ball in the air
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
  const maxHitStrength = 17;

  // Name
  const [name, setName] = useState("Makke");
  const [highScoreData, setHighScoreData] = useState({});
  const [showHighScoreData, setShowHighScoreData] = useState(false);

  // SCROLLING
  const gameAreaRef = useRef(null); // Game area reference for scrolling
  const [scrollLeft, setScrollLeft] = useState(0); // Scroll position

  console.log("Component render", {
    verticalVelocity,
    horizontalVelocity,
    gravity,
    airResistance,
    gameAreaWidth,
    isHit,
    gameAreaHeight,
  });

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

  // Define hitbox entry and compare it to mouseUP to determine ball swing angle
  // Hitbox exit is just used for reference for future
  useEffect(() => {
    if (
      ballPosition.top > hitboxTopBoundary &&
      ballPosition.top < hitboxTopBoundary + 25 &&
      ballPosition.left === 100 &&
      verticalVelocity > 0
    ) {
      setHitboxEntryTime(performance.now());
      // console.log("enter", performance.now());
    }
    if (
      ballPosition.top > hitboxBottomBoundary &&
      ballPosition.left === 100 &&
      verticalVelocity > 1
    ) {
      setHitboxExitTime(performance.now());
      // console.log("exit", performance.now());
    }
  }, [ballPosition.top, ballPosition.left, verticalVelocity, bottomLimit]);

  // MAIN BALL MOVEMENT AND FLIGHT PHYSICS
  useEffect(() => {
    const verticalVelocityRef = useRef(verticalVelocity);
    const horizontalVelocityRef = useRef(horizontalVelocity);
    const ballPositionRef = useRef(ballPosition); // Use the current state as the initial value

    let animationFrameId; // This will hold our frame ID from requestAnimationFrame

    const updatePosition = () => {
      // Calculate the new velocity
      verticalVelocityRef.current += gravity;
      horizontalVelocityRef.current *= isHit ? airResistance : 1;

      // Calculate the new position
      let newTop = ballPositionRef.current.top + verticalVelocityRef.current;
      let newLeft =
        ballPositionRef.current.left + horizontalVelocityRef.current;

      // Apply checks and make changes if necessary
      if (newTop >= bottomLimit) {
        newTop = bottomLimit;
        verticalVelocityRef.current *= -bounce;
        horizontalVelocityRef.current *= 1 - 0.1;
        if (Math.abs(horizontalVelocityRef.current) < 1) {
          setIsSpinning(false); // Stop spinning
        }
      }

      // Update the ref with the new position
      ballPositionRef.current = { top: newTop, left: newLeft };

      // Set state that should cause re-render
      setBallPosition(ballPositionRef.current);
      setVerticalVelocity(verticalVelocityRef.current);
      setHorizontalVelocity(horizontalVelocityRef.current);
      setDistance((newLeft / 100).toFixed(2)); // Update distance based on new left position

      // Request next animation frame
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    // Start the animation loop
    animationFrameId = requestAnimationFrame(updatePosition);

    // Clean up function
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    gravity,
    airResistance,
    bounce,
    bottomLimit,
    isHit,
    setDistance,
    setIsSpinning,
  ]); // Only include values and setter functions that should trigger the effect to restart

  // Get performance time in ms when user press mouseDOWN
  const handleMouseDown = () => {
    setMouseDownTime(performance.now());
  };
  // Do the swing when mouseUP
  const handleMouseUp = () => {
    // If you want to restart, just click again after swing
    if (isHit) {
      resetGame();
      return;
    }
    setIsHit(true); // toggle swing, animation etc.
    const mouseUpTime = performance.now(); // Performance time in ms when mouseUP
    const reactionTime = mouseUpTime - mouseDownTime; // Calculate how fast user clicks mouse
    const clicked = performance.now(); // This is old, but I use it to calculate the swing angle.
    if (
      clicked >= hitboxEntryTime &&
      clicked <= hitboxEntryTime + hitboxTransitTime
    ) {
      setIsSpinning(true); // start spinning the ball
      const timeIntoHitbox = clicked - hitboxEntryTime;
      const angle = 90 - (timeIntoHitbox / hitboxTransitTime) * 180;
      const radians = (angle * Math.PI) / 180;
      // HitStrength is defined by how was the player can click.
      setHitStrength(calculateHitStrength(reactionTime));
      // console.log("hit strength", hitStrength);
      // Set direction of velocity. Same speed for up and right.
      // MAIN BALL MOVEMENT useEffect has these dependancies and updates when these change.
      const verticalVelocityComponent = hitStrength * Math.sin(radians);
      const horizontalVelocityComponent = hitStrength * Math.cos(radians);
      setVerticalVelocity(-verticalVelocityComponent);
      setHorizontalVelocity(horizontalVelocityComponent);
      // For HUD
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
    console.log(reactionTime, hitStrength);
    return hitStrength;
  };

  // New swing actually. Reset to initial positions and states.
  const resetGame = () => {
    setVerticalVelocity(-7); // Reset to initial vertical velocity
    setHorizontalVelocity(0); // Reset to initial horizontal velocity
    setHitAngle(0); // Reset hit angle
    setIsHit(false); // Reset hit status
    setLastHitPosition({ top: 0, left: 0 }); // Reset the last hit position
    setScrollLeft(0); // Reset scroll position
    setIsSpinning(false); // No spinning anymore
    setHitboxEntryTime(null); // reset the hitbox entry times
    setHitboxExitTime(null);
    setDistance(0);

    // Reset the ball position to the start
    setBallPosition({
      top: bottomLimit - 250,
      left: 100,
    });
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
