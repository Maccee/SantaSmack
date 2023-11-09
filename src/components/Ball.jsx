import Arrow from "../assets/arrow.svg";

const Ball = ({ top, left, isSpinning, distance, isHit, verticalVelocityRef }) => {
  const minTopPosition = 0;
  const isOffScreen = top < minTopPosition;
  const distanceTop = isOffScreen ? minTopPosition : top - 100;

  const ballStyle = {
    top: `${top}px`,
    left: `${left}px`,
    animationPlayState: isSpinning ? 'running' : 'paused',
  };

  const distanceStyle = {
    top: `${distanceTop}px`,
    left: `${left + 10}px`,
    

  };

  // Define the style for the arrow, including conditional rotation
  const arrowStyle = {
    transform: verticalVelocityRef.current > 0 ? 'rotate(180deg)' : 'none',
    width: '30px',
  };

  return (
    <>
      <div className="ball" style={ballStyle}></div>
      {isHit && (
        <div className="distance" style={distanceStyle}>
          {isOffScreen && (
            <img src={Arrow} alt="Arrow" style={arrowStyle} />
          )}
          <p>{distance}</p>


        </div>
      )}
    </>
  );
};

export default Ball;
