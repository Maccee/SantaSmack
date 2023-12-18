import React, { useMemo } from "react";
import KylttiImg from "../assets/kyltti-lp-silver.webp"; 

const Markers = ({ gameAreaWidth, gameAreaHeight }) => {
  
  const markers = useMemo(() => {
    const interval = 1000; 
    const count = Math.floor(gameAreaWidth / interval);
    
    return Array.from({ length: count }, (_, index) => (index + 1) * interval);
  }, [gameAreaWidth]); 

  return (
    <>
      {markers.map((distance, index) => (
        <div
          key={index}
          className="marker"
          style={{
            left: `${distance}px`,
            top: `${gameAreaHeight - 260}px`,
          }}
        >
          <img src={KylttiImg} alt={`Marker at ${distance / 100} meters`}></img>
          <div style={{ top: `65px` }}>{distance / 100}M</div>
        </div>
      ))}
    </>
  );
};

export default Markers;
