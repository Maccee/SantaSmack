const Ball = ({ top, left, isSpinning, distance, isHit }) => {
  // Conditionally prevent the distance marker of the ball to go offscreen.
  const minTopPosition = 0; 
  const distanceTop = top < minTopPosition ? minTopPosition : top - 100;

  const ballStyle = {
    top: `${top}px`,
    left: `${left}px`,
    animationPlayState: isSpinning ? "running" : "paused",
  };

  const distanceStyle = {
    top: `${distanceTop}px`,
    left: `${left + 10}px`,
  };

  return (
    <>
      <div className="ball" style={ballStyle}></div>
      {isHit && (
        <div className="distance" style={distanceStyle}>{distance}</div>
      )}
    </>
  );
};

export default Ball;
