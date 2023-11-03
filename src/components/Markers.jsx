import React, { useMemo } from 'react';
import KylttiImg from "../assets/kyltti.png"; // Picture of a sign where distance is displayed in game area.

const Markers = ({ gameAreaWidth }) => {
    
    // Only recalculate markers if gameAreaWidth changes
    const markers = useMemo(() => {
        const interval = 1000; // Distance between markers
        const count = Math.floor(gameAreaWidth / interval);
        // Generate the markers array
        console.log("generating markers");
        return Array.from({ length: count }, (_, index) => (index + 1) * interval);
    }, [gameAreaWidth]); // Dependencies array

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
                    <img src={KylttiImg} alt={`Marker at ${distance / 100} meters`}></img>
                    <div>{distance / 100}m</div>
                </div>
            ))}
        </>
    );
};

export default Markers;
