import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import SantaSVG from "./assets/santa.svg";

const Bat = ({ showHitbox, hitboxTopBoundary, bottomLimit }) => {
  const santaStyle = {
    position: "absolute",
    top: `${bottomLimit}px`,
    left: "0px",
  };

  const hitboxStyle = {
    position: "absolute",
    top: `${hitboxTopBoundary}px`,
    left: "0px",
    width: "200px",
    height: "100px",
    backgroundColor: "rgba(255,0,0,0.3)",
    display: showHitbox ? "block" : "none",
  };

  return (
    <div>
      <div className="santa" style={santaStyle}>
        <img src={SantaSVG} alt="Santa" />
      </div>
      <div style={hitboxStyle}></div>
    </div>
  );
};

const Ball = ({ top, left }) => {
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

  const gameAreaWidth = 60000;
  const [gameAreaHeight, setGameAreaHeight] = useState(window.innerHeight);

  const bottomLimit = gameAreaHeight - 40;

  const [hitboxEntryTime, setHitboxEntryTime] = useState(null);
  const [hitboxExitTime, setHitboxExitTime] = useState(null);

  const hitboxTopBoundary = bottomLimit - 160;
  const hitboxBottomBoundary = bottomLimit - 60;

  const gravity = 0.1;
  const airResistance = 0.9999;
  const bounce = 0.5; // 50%

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

  // VH RESIZE
  useEffect(() => {
    const handleResize = () => {
      setGameAreaHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // SET HITBOX ENTRY
  useEffect(() => {
    if (
      ballPosition.top > hitboxTopBoundary &&
      ballPosition.top < hitboxTopBoundary + 25 &&
      ballPosition.left === 100 &&
      verticalVelocity > 0
    ) {
      setHitboxEntryTime(performance.now());
      
    }
    if (
      ballPosition.top > hitboxBottomBoundary &&
      ballPosition.left === 100 &&
      verticalVelocity > 1
    ) {
      setHitboxExitTime(performance.now());
      
    }
  }, [ballPosition.top, ballPosition.left, verticalVelocity, bottomLimit]);

  useEffect(() => {
    let animationFrameId;
    const updatePosition = () => {
      animationFrameId = requestAnimationFrame(updatePosition);
     
      setBallPosition((prevPosition) => {
        let newVerticalVelocity = verticalVelocity;
        let newHorizontalVelocity = horizontalVelocity;
        newVerticalVelocity += gravity;
        let newTop = prevPosition.top + newVerticalVelocity;
        let newLeft = prevPosition.left + newHorizontalVelocity;

        if (newTop >= bottomLimit) {
          newTop = bottomLimit;
          newVerticalVelocity = -newVerticalVelocity * bounce;
          newHorizontalVelocity *= 1 - 0.1;
        } else if (isHit) {
          newHorizontalVelocity *= airResistance;
        }

        // PYSÄYTÄ PYÖRIMINEN!
        if (Math.abs(newHorizontalVelocity) < 0.1) {
          newHorizontalVelocity = 0;

        }

        setVerticalVelocity(newVerticalVelocity);
        setHorizontalVelocity(newHorizontalVelocity);
        setScrollLeft((prevScrollLeft) => {
          const newScrollLeft = newLeft - window.innerWidth / 2;
          return Math.max(
            0,
            Math.min(newScrollLeft, gameAreaWidth - window.innerWidth)
          );
        });
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

  // HIT HIT HIT!!!!
  const handleMouseDown = () => {
    const clicked = performance.now();
    console.log("clicked:", clicked);
    const hitboxTransitTime = 200;
    if (
      clicked >= hitboxEntryTime &&
      clicked <= hitboxEntryTime + hitboxTransitTime
    ) {
      setIsHit(true);
      const timeIntoHitbox = clicked - hitboxEntryTime;
      const angle = 90 - (timeIntoHitbox / hitboxTransitTime) * 180;
      const radians = (angle * Math.PI) / 180;
      const hitStrength = 25;
      const verticalVelocityComponent = hitStrength * Math.sin(radians);
      const horizontalVelocityComponent = hitStrength * Math.cos(radians);

      setVerticalVelocity(-verticalVelocityComponent);
      setHorizontalVelocity(horizontalVelocityComponent);

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
        <p>Ball Position: {ballPosition.top.toFixed(0)}px</p>
        <p>Hit Angle: {hitAngle.toFixed(0)}°</p>
        <p>Horizontal Velocity: {horizontalVelocity.toFixed(2)}px/frame</p>
        <p>Distance Right: {ballPosition.left.toFixed(0)}px</p>
        <p>Bottom: {bottomLimit}</p>
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
        <div className="ground"></div>
        <div className="background">MISSÄ TÄÄ ON</div>
      </div>
    </div>
  );
}

export default App;
