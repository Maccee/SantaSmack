import React, { useState, useEffect } from 'react';
import './App.css';

function Bat({ showHitbox }) {
  const hitboxStyle = {
    position: 'absolute',
    top: '450px', // Adjust based on your bat's hitbox top position
    left: '50px', // Adjust based on your bat's hitbox left position
    width: '100px', // Width of the hitbox
    height: '100px', // Height of the hitbox
    backgroundColor: 'rgba(255,0,0,0.3)', // Semi-transparent red
    display: showHitbox ? 'block' : 'none', // Only show when debugging
  };

  return (
    <div>
      <div className="bat"></div>
      <div style={hitboxStyle}></div> {/* This is the hitbox */}
    </div>
  );
}


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
  const [ballPosition, setBallPosition] = useState({ top: 0, left: 100 });
  const [verticalVelocity, setVerticalVelocity] = useState(0);
  const [horizontalVelocity, setHorizontalVelocity] = useState(0);
  const [hitAngle, setHitAngle] = useState(0);
  const [isHit, setIsHit] = useState(false);
  const [showHitbox, setShowHitbox] = useState(true);
  const [lastHitPosition, setLastHitPosition] = useState({ top: 0, left: 0 });
  const [scrollLeft, setScrollLeft] = useState(0);
const gameAreaWidth = 60000; // The new game area width


  // Constants for gravity and air resistance
  const gravity = 0.5; // Reduce gravity acceleration
  const airResistance = 0.99999999; // Increase air resistance to slow down the ball horizontally

  useEffect(() => {
    const interval = setInterval(() => {
      setBallPosition(prevPosition => {
        let newVerticalVelocity = verticalVelocity;
        let newHorizontalVelocity = horizontalVelocity;
  
        // Apply gravity at all times
        newVerticalVelocity += gravity;
  
        // Calculate new position
        let newTop = prevPosition.top + newVerticalVelocity;
        let newLeft = prevPosition.left + newHorizontalVelocity;
  
        // Check if the ball is hitting the ground
        if (newTop >= 550) {
          newTop = 550; // Stop the ball at 580px
          newVerticalVelocity = -newVerticalVelocity * 0.5; // Bounce with 70% of the velocity
          newHorizontalVelocity *= (1 - 0.1); // Apply ground friction
        } else if (isHit) {
          // Apply normal air resistance if the ball has been hit and is in the air
          newHorizontalVelocity *= airResistance;
        }
  
        // Prevent ball from rolling indefinitely due to very small velocities
        if (Math.abs(newHorizontalVelocity) < 0.1 && newTop === 550) {
          newHorizontalVelocity = 0;
        }
  
        // Update the velocities
        setVerticalVelocity(newVerticalVelocity);
        setHorizontalVelocity(newHorizontalVelocity);
  
        // Update the scroll position if the ball moves horizontally
        setScrollLeft((prevScrollLeft) => {
          const newScrollLeft = newLeft - window.innerWidth / 2;
          return Math.max(0, Math.min(newScrollLeft, gameAreaWidth - window.innerWidth));
        });
  
        return { top: newTop, left: newLeft };
      });
    }, 10); // Run this interval every 20 ms
  
    return () => clearInterval(interval);
  }, [verticalVelocity, horizontalVelocity, isHit]);
  
  
  
  
  const handleMouseDown = () => {
    if (ballPosition.top >= 450 && ballPosition.top <= 550 && !isHit) {
      setIsHit(true);
  
      // Calculate the angle based on the ball's vertical position relative to the perfect hit point
      // We map the range of 450px - 550px to the range of 90 degrees to -90 degrees
      const distanceFromPerfectHit = 500 - ballPosition.top;
      const angle = (distanceFromPerfectHit / 50) * 90; // Mapping to -90 to 90 degrees
  
      // Determine the components of the velocity based on the angle
      const hitStrength = 50; // This is the total velocity you want to impart on the ball
      const radians = (angle * Math.PI) / 180; // Convert angle to radians for calculation
  
      // Calculate the vertical and horizontal components of the velocity
      // Here, Math.cos is used for the vertical component since we want 0 degrees to be straight right (cos(0) = 1)
      // And Math.sin is used for the horizontal component since we want 90 degrees to be straight up (sin(90) = 1)
      const verticalVelocityComponent = hitStrength * Math.sin(radians);
      const horizontalVelocityComponent = hitStrength * Math.cos(radians);
  
      setVerticalVelocity(-verticalVelocityComponent); // Negate to move in the correct direction in screen space
      setHorizontalVelocity(horizontalVelocityComponent); // Positive for right, as per the screen's coordinate system
  
      // Record the last hit position
      setLastHitPosition({ top: ballPosition.top, left: ballPosition.left });
      setHitAngle(angle);
    }
  };
  
  return (
    <div className="game-area" onMouseDown={handleMouseDown} style={{ width: `${gameAreaWidth}px`, overflowX: 'hidden' }}>
      {/* HUD to display ball info */}
      <div className="hud" style={{ position: 'fixed', top: 0, right: 0 }}>
        <p>Last Hit Position: {lastHitPosition.top.toFixed(0)}px from top, {lastHitPosition.left.toFixed(0)}px from left</p>
        <p>Top Position: {ballPosition.top.toFixed(0)}px</p>
        <p>Hit Angle: {hitAngle.toFixed(0)}°</p>
        <p>Distance Right: {ballPosition.left.toFixed(0)}px</p>
      </div>
      <div className="scroll-container" style={{ transform: `translateX(-${scrollLeft}px)` }}>
        <Bat showHitbox={showHitbox} />
        <Ball top={ballPosition.top} left={ballPosition.left} />
      </div>
    </div>
  );
  
}

export default App;
