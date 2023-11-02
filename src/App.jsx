import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import SantaSVG from "./assets/santa.svg";

const Bat = ({ showHitbox, hitboxTopBoundary, bottomLimit }) => {
   const santaStyle = {
    position: "absolute",
    top: `${bottomLimit - 40}px`,
    left: "0px",
  };

  const hitboxStyle = {
    position: "absolute",
    top: `${hitboxTopBoundary}px`, // This positions the hitbox just above the bottom limit
    left: "0px", // Adjust based on your bat's hitbox left position
    width: "200px", // Width of the hitbox
    height: "100px", // Height of the hitbox
    backgroundColor: "rgba(255,0,0,0.3)", // Semi-transparent red
    display: showHitbox ? "block" : "none", // Only show when debugging
  };

  return (
    <div>
      <div className="santa" style={santaStyle}>
        <img src={SantaSVG} alt="Santa" /> {/* Corrected img tag */}
      </div>
      <div style={hitboxStyle}></div> {/* This is the hitbox */}
    </div>
  );
};

function Ball({ top, left }) {
  return (
    <div
      className="ball"
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
    />
  );
}

function App() {
  const [verticalVelocity, setVerticalVelocity] = useState(-7);
  const [horizontalVelocity, setHorizontalVelocity] = useState(0);
  const [hitAngle, setHitAngle] = useState(0);
  const [isHit, setIsHit] = useState(false);
  const [showHitbox, setShowHitbox] = useState(true);
  const [lastHitPosition, setLastHitPosition] = useState({ top: 0, left: 0 });
  const [scrollLeft, setScrollLeft] = useState(0);

  const gameAreaWidth = 60000; // The new game area width
  const [gameAreaHeight, setGameAreaHeight] = useState(window.innerHeight); // 96% of the viewport height
  // Use dynamic bottom value based on game area height
  const bottomLimit = gameAreaHeight;

  const [hitboxEntryTime, setHitboxEntryTime] = useState(null);
  const [hitboxExitTime, setHitboxExitTime] = useState(null);

  const hitboxTopBoundary = bottomLimit - 200; // Top boundary of the hitbox
  const hitboxBottomBoundary = bottomLimit - 100; // Bottom boundary of the hitbox

  // Constants for gravity and air resistance
  const gravity = 0.1; // Reduce gravity acceleration
  const airResistance = 0.9999; // Increase air resistance to slow down the ball horizontally
  const bounce = 0.5; // Bounce with 50% of the velocity

  const gameAreaRef = useRef(null);
  const [ballPosition, setBallPosition] = useState({
    top: bottomLimit - 250,
    left: 100,
  });

  useEffect(() => {
    if (gameAreaRef.current) {
      const element = gameAreaRef.current;
      element.scrollTop = element.scrollHeight - element.clientHeight;
    }
    
  }, []);

  // Determine vh size
  useEffect(() => {
    // Function to update the game area height
    const handleResize = () => {
      setGameAreaHeight(window.innerHeight);
    };
    // Set up the event listener
    window.addEventListener("resize", handleResize);
    // Call the handler right away so state gets updated with initial window size
    handleResize();
    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set hitbox entry
  useEffect(() => {
    if (
      ballPosition.top > hitboxTopBoundary &&
      ballPosition.top < hitboxTopBoundary + 25 &&
      ballPosition.left === 100 &&
      verticalVelocity > 0
    ) {
      setHitboxEntryTime(performance.now());
      console.log("Hitbox Entry Time:", performance.now());
    }
    // Check for hitbox exit for debug
    if (ballPosition.top > hitboxBottomBoundary && ballPosition.left === 100 && verticalVelocity > 1) {
      setHitboxExitTime(performance.now());
      console.log("Hitbox Exit Time:", performance.now());
    }
  }, [ballPosition.top, ballPosition.left, verticalVelocity, bottomLimit]); // Added bottomLimit here

  useEffect(() => {
    let animationFrameId;
    // Update function that we will run on every frame
    const updatePosition = () => {
      // We'll wrap this in a requestAnimationFrame to ensure it's synced with browser repaints
      animationFrameId = requestAnimationFrame(updatePosition);
      // for debug only
     // if (hitboxEntryTime) {
      //  setBallPosition(ballPosition);
      //  return;
      //}
      setBallPosition((prevPosition) => {
        let newVerticalVelocity = verticalVelocity;
        let newHorizontalVelocity = horizontalVelocity;
        // Apply gravity at all times
        newVerticalVelocity += gravity;
        // Calculate new position
        let newTop = prevPosition.top + newVerticalVelocity;
        let newLeft = prevPosition.left + newHorizontalVelocity;
        // Check if the ball is hitting the ground
        if (newTop >= bottomLimit + 100) {
          newTop = bottomLimit;
          newVerticalVelocity = -newVerticalVelocity * bounce;
          newHorizontalVelocity *= 1 - 0.1; // ground friction
        } else if (isHit) {
          // Apply normal air resistance if the ball has been hit and is in the air
          newHorizontalVelocity *= airResistance;
        }
        // Prevent ball from rolling indefinitely due to very small velocities
        if (Math.abs(newHorizontalVelocity) < 0.1) {
          newHorizontalVelocity = 0;
        }
        // Update the velocities
        setVerticalVelocity(newVerticalVelocity);
        setHorizontalVelocity(newHorizontalVelocity);
        // Update the scroll position if the ball moves horizontally
        setScrollLeft((prevScrollLeft) => {
          const newScrollLeft = newLeft - window.innerWidth / 2;
          return Math.max(
            0,
            Math.min(newScrollLeft, gameAreaWidth - window.innerWidth)
          );
        });
        // Return new position for the state update
        return { top: newTop, left: newLeft };
      });
    };

    // Start the animation loop
    animationFrameId = requestAnimationFrame(updatePosition);

    // Clean up function to cancel the animation frame when the component unmounts
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


  // HIT HIT HIT!!!!
  const handleMouseDown = () => {
    const clicked = performance.now();
    console.log("clicked:", clicked);
    // Time it takes for the ball to pass through the hitbox
    const hitboxTransitTime = 200; // in milliseconds
    // Check if the click was within the time the ball takes to pass the hitbox
    if (
      clicked >= hitboxEntryTime &&
      clicked <= hitboxEntryTime + hitboxTransitTime
    ) {
      setIsHit(true);
      // Calculate how much time into the hitbox the click occurred
      const timeIntoHitbox = clicked - hitboxEntryTime;
      // Calculate the angle based on the time into the hitbox
      // -90 degrees when the ball enters the hitbox, +90 degrees when the ball leaves
      const angle = 90 - (timeIntoHitbox / hitboxTransitTime) * 180;
      // Convert the angle to radians
      const radians = (angle * Math.PI) / 180;
      // Determine the hit strength
      const hitStrength = 15;
      // Calculate the vertical and horizontal components of the velocity
      const verticalVelocityComponent = hitStrength * Math.sin(radians);
      const horizontalVelocityComponent = hitStrength * Math.cos(radians);
      // Apply the new velocities
      setVerticalVelocity(-verticalVelocityComponent); // Negate because the screen's Y-coordinates increase downwards
      setHorizontalVelocity(horizontalVelocityComponent);
      // Record the last hit position and the hit angle for the HUD
      setLastHitPosition({ top: ballPosition.top, left: ballPosition.left });
      setHitAngle(angle);
    }
  };

  return (
    <div ref={gameAreaRef} className="game-area" onMouseDown={handleMouseDown}>
      <div className="hud" style={{ position: "fixed", top: 0, right: 0 }}>
        <p>
          Last Hit Position: {lastHitPosition.top.toFixed(0)}px from top,
          {lastHitPosition.left.toFixed(0)}px from left
        </p>
        <p>Top Position: {ballPosition.top.toFixed(0)}px</p>
        <p>Hit Angle: {hitAngle.toFixed(0)}°</p>
        <p>Horizontal Velocity: {horizontalVelocity.toFixed(2)}px/frame</p>
        <p>Distance Right: {ballPosition.left.toFixed(0)}px</p>
      </div>
      <div
        className="scroll-container"
        style={{ transform: `translateX(-${scrollLeft}px)` }}
      >
        <Bat
          showHitbox={showHitbox}
          hitboxTopBoundary={hitboxTopBoundary}
          bottomLimit={bottomLimit}
        />
        <Ball top={ballPosition.top} left={ballPosition.left} />
      </div>
      <div className="ground"></div>
    </div>
  );
}

export default App;
