import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import { postDataToAzureFunction, getDataFromAzureFunction } from "./ApiUtils";

// Component Imports
import Santa from "./components/Santa";
import Bat from "./components/Bat";
import Markers from "./components/Markers";
import Ball from "./components/Ball";

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
  const gravity = 0.1; // Downward force that pulls ball down while flying
  const airResistance = 0.9999; // Resistance to slow the ball in the air
  const bounce = 0.5; // 50% bounce strength

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
  const postedRef = useRef(false);
  const [database, setDatabase] = useState([]);

  // SCROLLING
  const gameAreaRef = useRef(null); // Game area reference for scrolling
  const [scrollLeft, setScrollLeft] = useState(0); // Scroll position

  useEffect(() => {
    if (gameAreaRef.current) {
      const element = gameAreaRef.current;
      element.scrollTop = element.scrollHeight - element.clientHeight;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await getDataFromAzureFunction();
        result = result.sort((a, b) => b.distance - a.distance);
        setDatabase(result);
        console.log(database);
      } catch (error) {
        console.error("There was an error fetching the data:", error);
      }
    };
    fetchData();
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

  // MAIN BALL MOVEMENT AND FLIGHT PHYSICS, SUCH
  useEffect(() => {
    let animationFrameId;
    const updatePosition = () => {
      animationFrameId = requestAnimationFrame(updatePosition);

      // For debug
      if (hitboxEntryTime) {
      }
      if (hitboxExitTime) {
      }

      // Update ball position
      setBallPosition((prevPosition) => {
        let newVerticalVelocity = verticalVelocity;
        let newHorizontalVelocity = horizontalVelocity;
        newVerticalVelocity += gravity;
        let newTop = prevPosition.top + newVerticalVelocity;
        let newLeft = prevPosition.left + newHorizontalVelocity;

        // CHECKS
        // If Ball hits bottomLimit, it bounces, and slows down
        if (newTop >= bottomLimit) {
          newTop = bottomLimit;
          newVerticalVelocity = -newVerticalVelocity * bounce;
          newHorizontalVelocity *= 1 - 0.1;

          // While in the air, apply air resistance
        } else if (isHit) {
          newHorizontalVelocity *= airResistance;
        }

        // Stop motion.
        // If speed is between 0 and 1, stop movement completely and check for highscore
        if (
          Math.abs(newHorizontalVelocity) < 1 &&
          Math.abs(newHorizontalVelocity) > 0
        ) {
          newHorizontalVelocity = 0; // Stop movement

          // CHECK FOR NEW HIGHSCORE
          if (distance > highScore && !postedRef.current) {
            postedRef.current = true;
            setHighScore(distance);
            const data = {
              name, // Assume 'name' is available in the component's state or props
              hitAngle, // Assume 'hitAngle' is available in the component's state or props
              hitStrength, // Assume 'hitStrength' is available in the component's state or props
              gameAreaHeight, // Assume 'gameAreaHeight' is available in the component's state or props
              distance, // Convert it to a string if needed
            };
            // console.log("posting" , data);
            postDataToAzureFunction(data);
          }
        }

        // Stop ball spinning slightly before stopping
        if (Math.abs(newHorizontalVelocity) < 1 && isHit) {
          setIsSpinning(false); // Stop spinning
        }

        setDistance((ballPosition.left / 100).toFixed(2)); // Set distance from pixels to makeshift metres and remove decimal
        setVerticalVelocity(newVerticalVelocity); // update speed
        setHorizontalVelocity(newHorizontalVelocity); // update speed

        // Scroll
        setScrollLeft((prevScrollLeft) => {
          const newScrollLeft = newLeft - window.innerWidth / 5; // Ball position while scrolling
          return Math.max(
            0,
            Math.min(newScrollLeft, gameAreaWidth - window.innerWidth)
          );
        });
        // Updating the state with the new ball position, which will be used in the component to position the ball
        return { top: newTop, left: newLeft };
      });
    };
    animationFrameId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    verticalVelocity,
    horizontalVelocity,
    gravity,
    airResistance,
    gameAreaWidth,
    isHit,
    gameAreaHeight,
  ]);

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

    // console.log("clicked", performance.now());

    // For current hitbox settings it takes roughly 300ms for the ball to travel through the hitbox.
    // Within that hitboxTransitTime the player should be able to swing.
    // In here we check if the 'clicked' is within the transitTime by comparing it to the hitbox entry time.
    // Example, entry time is 3000ms, exit time is 3000ms + hitboxTransitTime = 3300ms.
    // If the 'clicked' time in ms is between 3000ms and 3300ms the player will hit the ball.
    if (
      clicked >= hitboxEntryTime &&
      clicked <= hitboxEntryTime + hitboxTransitTime
    ) {
      setIsSpinning(true); // start spinning the ball

      // This calculates the angle. Using last example, if if player can click at 3000ms performance.now time,
      // the angle is 90deg, which in this case swings the ball straight upwards. If player is able to click at
      // 3300ms, -90deg, the swing is straight down. 3150ms is 0deg which is straight right. Sweetspot (45deg) is
      // 3075ms. So 75ms after ball enters the hitbox.
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
    postedRef.current = false;

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
  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log(event.key, event.keyCode);
      // The tilde key's keyCode is 220
      if (event.keyCode === 220 || event.keyCode === 192) {
        toggleHUD();
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener on cleanup
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (event) => {
    if (event.keyCode === 32 && !keyActive) {
      //event.preventDefault(); // Prevent the default action to avoid scrolling the page
      handleMouseDown();
      setKeyActive(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.keyCode === 32) {
      //event.preventDefault(); // Prevent the default action to avoid scrolling the page
      handleMouseUp();
      setKeyActive(false);
    }
  };

  // APP RENDER
  return (
    <div
      ref={gameAreaRef}
      className="game-area"
      tabIndex={0}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={() => setKeyActive(false)}
    >
      {/* Background layers with parallax scrolling effect */}
      <div
        className="background"
        style={{ transform: `translateX(-${scrollLeft / 5}px)` }}
      ></div>
      <div
        className="background2"
        style={{ transform: `translateX(-${scrollLeft / 10}px)` }}
      ></div>

      {/* HUD (Heads-Up Display) for displaying game stats and controls */}
      <div className="hud" style={{ position: "fixed", top: 0, right: 0 }}>
        {showHUD && (
          <>
            <h2>Debug Console</h2>
            {/* Display the last hit position */}
            <p>
              Last Hit Position: {lastHitPosition.top.toFixed(0)}px from top,
              {lastHitPosition.left.toFixed(0)}px from left
            </p>
            {/* Display the current ball position */}
            <p>Ball Position: {ballPosition.top.toFixed(0)}px</p>
            {/* Display the angle at which the ball was hit */}
            <p> Hit Angle: {hitAngle.toFixed(0)}° </p>
            {/* Display the horizontal velocity of the ball */}
            <p>Horizontal Velocity: {horizontalVelocity.toFixed(2)}px/frame</p>
            <p>Vertical Velocity: {verticalVelocity.toFixed(2)}px/frame</p>{" "}
            {/* Corrected the duplicate "Horizontal Velocity" label */}
            {/* Display the current distance traveled by the ball */}
            <p>Distance Right: {ballPosition.left.toFixed(0)}px</p>
            {/* Display the current distance in meters (assuming 100px = 1m) */}
            <p>Distance meters: {distance}</p>
            {/* Display the bottom limit of the game area */}
            <p>Bottom: {bottomLimit}</p>
            {/* Indicate whether the ball has been hit */}
            <p>IsHit: {isHit ? "true" : "false"}</p>
            {/* Restart button for debugging purposes */}
            <button onClick={toggleShowHitbox}>Display Hitbox</button>
            {/* Display the high score */}
            <p>Highscore: {highScore}m</p>
            <p>{hitStrength}</p>
            <>
              {database ? (
                database.map((item, index) => (
                  <div key={index}>
                    <p>Distance: {item.distance}</p>
                  </div>
                ))
              ) : (
                <p>Loading data...</p>
              )}
            </>
          </>
        )}
      </div>

      <div
        className="highScoreContainer"
        style={{ position: "fixed", bottom: "10px", right: "10px" }}
      >
        <p>Highscore: {highScore}</p>
      </div>
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
  );
};

export default App;
