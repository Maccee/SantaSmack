import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import SantaImg from "./assets/pukki.png";
import KylttiImg from "./assets/kyltti.png";

const Santa = ({
  showHitbox,
  hitboxTopBoundary,
  hitboxBottomBoundary,
  bottomLimit,
}) => {
  const santaStyle = {
    top: `${bottomLimit + 23}px`,
    left: "0px",
  };

  const hitboxStyle = {
    position: "absolute",
    top: `${hitboxTopBoundary}px`,
    left: "0px",
    width: "200px",
    height: `${hitboxBottomBoundary - hitboxTopBoundary}px`,
    backgroundColor: "rgba(255,0,0,0.3)",
    display: showHitbox ? "block" : "none",
  };

  return (
    <div>
      <div className="santa" style={santaStyle}>
        <img src={SantaImg} alt="Santa" />
      </div>
      <div style={hitboxStyle}></div>
    </div>
  );
};

const Bat = ({ isHit }) => {
  const batClass = isHit ? "bat hit" : "bat";
  return <div className={batClass} />;
};

const Ball = ({ top, left, isSpinning, distance }) => {
  const ballStyle = {
    top: `${top}px`,
    left: `${left}px`,
    animationPlayState: isSpinning ? "running" : "paused", // Control the animation state
  };

  const distanceStyle = {
    top: `${top - 100}px`,
    left: `${left + 10}px`,

  };

  return (
    <>
      <div className="ball" style={ballStyle}></div>
      <div className="distance" style={distanceStyle}>{distance}</div>
    </>
  );
};


const Markers = ({ markers }) => {
  return (
    <>
      {markers.map((distance, index) => (
        <div
          key={index}
          className="marker"
          style={{
            left: `${distance}px`,
          }}
        >
          <img src={KylttiImg}></img>
          <div>{distance / 100}m</div>
        </div>
      ))}
    </>
  );
};

function App() {
  const [verticalVelocity, setVerticalVelocity] = useState(-7);
  const [horizontalVelocity, setHorizontalVelocity] = useState(0);
  const [hitAngle, setHitAngle] = useState(0);
  const [isHit, setIsHit] = useState(false);

  const [lastHitPosition, setLastHitPosition] = useState({ top: 0, left: 0 });
  const [scrollLeft, setScrollLeft] = useState(0);

  const gameAreaWidth = 116000;
  const [gameAreaHeight, setGameAreaHeight] = useState(window.innerHeight);

  const bottomLimit = gameAreaHeight - 70;

  const [hitboxEntryTime, setHitboxEntryTime] = useState(null);
  const [hitboxExitTime, setHitboxExitTime] = useState(null);

  const [showHitbox, setShowHitbox] = useState(true);
  const hitboxTopBoundary = bottomLimit - 200;
  const hitboxBottomBoundary = bottomLimit + 30;

  const gravity = 0.1;
  const airResistance = 0.9999;
  const bounce = 0.5; // 50%

  const gameAreaRef = useRef(null);
  const [ballPosition, setBallPosition] = useState({
    top: bottomLimit - 250,
    left: 100,
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const markers = generateMarkers(gameAreaWidth, 1000);

  const [highScore, setHighScore] = useState(0);
  const [distance, setDistance] = useState("0")

  const [mouseDownTime, setMouseDownTime] = useState(0);

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
      if (hitboxEntryTime) {

      }
      if (hitboxExitTime) {

      }
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
        if (Math.abs(newHorizontalVelocity) < 0.2 && Math.abs(newHorizontalVelocity) > 0) {
          newHorizontalVelocity = 0;
          console.log((ballPosition.left / 100).toFixed(2), highScore);

          const currentScore = parseFloat((ballPosition.left / 100).toFixed(2));
          const currentHighScore = parseFloat(highScore.toFixed(2));

          if (currentScore > currentHighScore) {
            // If the current score is higher, update the high score
            setHighScore(currentScore);
          }
        }
        if (Math.abs(newHorizontalVelocity) < 1 && isHit) {
          setIsSpinning(false); // Stop spinning
        }
        setDistance((ballPosition.left / 100).toFixed(2));
        setVerticalVelocity(newVerticalVelocity);
        setHorizontalVelocity(newHorizontalVelocity);
        setScrollLeft((prevScrollLeft) => {
          const newScrollLeft = newLeft - window.innerWidth / 5;
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

  const handleMouseDown = () => {
    setMouseDownTime(performance.now());
  }
  // HIT HIT HIT!!!!
  const handleMouseUp = () => {
    if (isHit) {
      resetGame();
      return;
    }
    const mouseUpTime = performance.now();
    setIsHit(true);
    const reactionTime = mouseUpTime - mouseDownTime;
    const clicked = performance.now();

    const hitboxTransitTime = 300;
    if (
      clicked >= hitboxEntryTime &&
      clicked <= hitboxEntryTime + hitboxTransitTime
    ) {
      setIsSpinning(true);
      const timeIntoHitbox = clicked - hitboxEntryTime;
      const angle = 90 - (timeIntoHitbox / hitboxTransitTime) * 180;
      const radians = (angle * Math.PI) / 180;
      const hitStrength = calculateHitStrength(reactionTime);
      console.log("hit strength", hitStrength);
      const verticalVelocityComponent = hitStrength * Math.sin(radians);
      const horizontalVelocityComponent = hitStrength * Math.cos(radians);

      setVerticalVelocity(-verticalVelocityComponent);
      setHorizontalVelocity(horizontalVelocityComponent);

      setLastHitPosition({ top: ballPosition.top, left: ballPosition.left });
      setHitAngle(angle);
    }
  };

  // Define your minimum and maximum reaction times
  const minReactionTime = 20; // fastest expected reaction time
  const maxReactionTime = 180; // slowest expected reaction time

  // Define your minimum and maximum hit strengths
  const minHitStrength = 10;
  const maxHitStrength = 45;

  // Calculate hit strength based on reaction time
  const calculateHitStrength = (reactionTime) => {
    // Clamp reaction time within the expected range for safety
    const clampedReactionTime = Math.min(Math.max(reactionTime, minReactionTime), maxReactionTime);

    // Invert the reaction time to get the hit strength such that a lower reaction time gives a higher hit strength
    const normalizedTime = (clampedReactionTime - minReactionTime) / (maxReactionTime - minReactionTime);
    const hitStrength = maxHitStrength - normalizedTime * (maxHitStrength - minHitStrength);

    return hitStrength;
  };

  const resetGame = () => {
    setVerticalVelocity(-7); // Reset to initial vertical velocity
    setHorizontalVelocity(0); // Reset to initial horizontal velocity
    setHitAngle(0); // Reset hit angle
    setIsHit(false); // Reset hit status
    setLastHitPosition({ top: 0, left: 0 }); // Reset the last hit position
    setScrollLeft(0); // Reset scroll position
    setIsSpinning(false);
    setHitboxEntryTime(null)
    setHitboxExitTime(null)
    // Add any other state resets you need here

    // Also reset the ball's position to the starting point
    setBallPosition({
      top: bottomLimit - 250,
      left: 100,
    });
  };

  function generateMarkers(length, interval) {
    const count = Math.floor(length / interval);
    return Array.from({ length: count }, (_, index) => (index + 1) * interval);
  }

  return (
    <div ref={gameAreaRef} className="game-area" onMouseUp={handleMouseUp} onMouseDown={handleMouseDown}>
      <div
        className="background"
        style={{ transform: `translateX(-${scrollLeft / 5}px)` }}
      ></div>
      <div
        className="background2"
        style={{ transform: `translateX(-${scrollLeft / 10}px)` }}
      ></div>
      <div className="hud" style={{ position: "fixed", top: 0, right: 0 }}>
        <p><h2>Debug Console</h2></p>
        <p>
          Last Hit Position: {lastHitPosition.top.toFixed(0)}px from top,
          {lastHitPosition.left.toFixed(0)}px from left
        </p>
        <p>Ball Position: {ballPosition.top.toFixed(0)}px</p>
        <p>Hit Angle: {hitAngle.toFixed(0)}°</p>
        <p>Horizontal Velocity: {horizontalVelocity.toFixed(2)}px/frame</p>
        <p>Distance Right: {ballPosition.left.toFixed(0)}px</p>
        <p>Distance meters: {distance}</p>
        <p>Bottom: {bottomLimit}</p>
        <p>IsHit: {isHit ? "true" : "false"}</p>
        <br />
        <p>Highscore: {highScore}m</p>
        <p>{reactionTime}</p>
        <button onClick={resetGame}>Debug Restart</button>

      </div>

      <div
        className="scroll-container"
        style={{ transform: `translateX(-${scrollLeft}px)` }}
      >
        <Markers markers={markers} />
        <Santa
          showHitbox={showHitbox}
          hitboxTopBoundary={hitboxTopBoundary}
          hitboxBottomBoundary={hitboxBottomBoundary}
          bottomLimit={bottomLimit}
        />
        <Ball
          top={ballPosition.top}
          left={ballPosition.left}
          isSpinning={isSpinning}
          distance={distance}
        />
        <Bat isHit={isHit} />
        <div className="ground"></div>
      </div>
    </div>
  );
}

export default App;
