import React, { useMemo } from 'react';
import PoroImg from '../assets/poro.png'; // Assuming you have an image named poro.png

const Porot = ({ gameAreaWidth, gameAreaHeight }) => {
    const poros = useMemo(() => {
        const minDistance = 500;
        const maxDistance = 2000;
        const interval = maxDistance; 
        const count = Math.floor(gameAreaWidth / interval);
    
        // Generate random positions for poros with integer x values
        return Array.from({ length: count }, (_, index) => ({
          // Use Math.floor to get an integer value for x
          x: Math.floor((index * interval) + Math.random() * (maxDistance - minDistance) + minDistance),
          y: gameAreaHeight - 220, // The y position stays the same
        }));
      }, [gameAreaWidth, gameAreaHeight]);
    
  return (
    <>
      {poros.map((position, index) => (
        <img
          key={index}
          src={PoroImg}
          alt="Poro"
          style={{
            position: 'absolute', // Required to position them based on the left and top values
            left: `${position.x}px`,
            top: `${gameAreaHeight - 250}px`,
            width: `170px`,
            zIndex: `-1`
          }}
        />
      ))}
    </>
  );
};

export default Porot;
