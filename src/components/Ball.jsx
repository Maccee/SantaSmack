const Arrow = ({ isVelocityPositive, style }) => {
  const fillColor = isVelocityPositive ? "red" : "#77B3D4";
  return (
    <svg style={style} height="800px" width="800px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 64 64" xmlSpace="preserve">
      <style type="text/css">
      </style>
      <g id="Layer_1">
        <g>
          <circle fill={fillColor} cx="32" cy="32" r="32" />
        </g>
        <g className="st1">
          <path className="st2" d="M49.5,33.9L35.3,15.7c-1.8-2.3-4.7-2.3-6.5,0L14.5,33.9c-1.8,2.3-1,4.1,1.7,4.1H24v12c0,2.2,1.8,4,4,4h8
			c2.2,0,4-1.8,4-4V38h7.8C50.6,38,51.3,36.1,49.5,33.9z"/>
        </g>
        <g>
          <path className="st3" d="M40,48c0,2.2-1.8,4-4,4h-8c-2.2,0-4-1.8-4-4V24c0-2.2,1.8-4,4-4h8c2.2,0,4,1.8,4,4V48z" />
        </g>
        <g>
          <path className="st3" d="M16.2,36c-2.7,0-3.5-1.9-1.7-4.1l14.3-18.1c1.8-2.3,4.7-2.3,6.5,0l14.3,18.1c1.8,2.3,1,4.1-1.7,4.1H16.2z" />
        </g>
      </g>
      <g id="Layer_2">
      </g>
    </svg>
  );
};

const Ball = ({
  top,
  left,
  isSpinning,
  distance,
  isHit,
  verticalVelocityRef,
}) => {
  const minTopPosition = 100;
  const isOffScreen = top < minTopPosition;
  const distanceTop = isOffScreen ? minTopPosition : top - 110;

  const ballStyle = {
    top: `${top - 25}px`,
    left: `${left}px`,
    animationPlayState: isSpinning ? "running" : "paused",
  };

  const distanceStyle = {
    top: `${distanceTop}px`,
    left: `${left + 10}px`,
    
  };

  const arrowStyle = {
    transform: verticalVelocityRef.current > 0 ? "rotate(180deg)" : "none",
    width: "30px",
    height: "30px",
  };

  return (
    <>
      <div className="ball" style={ballStyle}>
        <div className="ballMarker"></div>
      </div>

      {isHit && (
        <div className="distance" style={distanceStyle}>
          {isOffScreen && <Arrow isVelocityPositive={verticalVelocityRef.current > 0} style={arrowStyle} />}
          <p>{distance}</p>
        </div>
      )}
    </>
  );
};

export default Ball;
