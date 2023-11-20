import React, { useEffect, useState } from "react";
import PoroImg from "../assets/poro.png"; // Assuming you have an image named poro.png
import HitPoroImg from "../assets/poro-potku.png"; // Assuming you have an image named poro.png

const Porot = ({ hitPorosRef, setPoros, gameAreaHeight, ballPositionRef }) => {
  const [lastPoroPosition, setLastPoroPosition] = useState(500); // Starting position for the first poro
  const [poros, setLocalPoros] = useState([]); // Local state to manage poros for rendering

  useEffect(() => {
    const addNewPoro = () => {
      const minDistance = 1500;
      const maxDistance = 4000;
      const newPoroPosition =
        lastPoroPosition +
        minDistance +
        Math.random() * (maxDistance - minDistance);

      const newPoro = {
        x: Math.floor(newPoroPosition),
        y: gameAreaHeight - 220,
      };

      setLocalPoros((prevPoros) => [...prevPoros, newPoro]);
      setPoros((prevPoros) => [...prevPoros, newPoro]); // Update parent state
      setLastPoroPosition(newPoroPosition);
    };

    if (ballPositionRef.current.left >= lastPoroPosition) {
      addNewPoro();
    }
  }, [ballPositionRef.current, lastPoroPosition]);

  return (
    <>
      {poros.map((position, index) => (
        <img
          key={`${position.x}-${position.y}-${index}`}
          src={hitPorosRef.current.has(index) ? HitPoroImg : PoroImg}
          alt="Poro"
          style={{
            position: "absolute",
            left: `${position.x}px`,
            top: `${gameAreaHeight - 260}px`,
            height: `230px`,
            objectFit: "contain",
          }}
        />
      ))}
    </>
  );
};

export default Porot;
