const HUD = ({
  showHUD,
  lastHitPosition,
  ballPosition,
  hitAngle,
  horizontalVelocity,
  horizontalVelocityRef,
  verticalVelocity,
  verticalVelocityRef,
  distance,
  bottomLimit,
  isHit,
  highScore,
  hitStrength,
  toggleShowHitbox
}) => {
  if (!showHUD) {
    return null;
  }

  return (
    <div className="hud" style={{ position: "fixed", top: 0, right: 0 }}>
      <h2>Debug Console</h2>
      <p>
        Hit Position from top: {lastHitPosition.top.toFixed(0)}px
      </p>
      <p>Ball Position: {ballPosition.top.toFixed(0)}px</p>
      <p>Hit Angle: {hitAngle.toFixed(0)}°</p>
      <p>Horizontal Velocity: {horizontalVelocityRef.current.toFixed(2)} / {horizontalVelocity.toFixed(2)}px/frame</p>
      <p>Vertical Velocity: {verticalVelocityRef.current.toFixed(2)} / {verticalVelocity.toFixed(2)}px/frame</p>
      <p>Distance Right: {ballPosition.left.toFixed(0)}px</p>
      <p>Distance meters: {distance}</p>
      <p>Bottom: {bottomLimit}</p>
      <p>IsHit: {isHit ? "true" : "false"}</p>
      <button onClick={toggleShowHitbox}>Display Hitbox</button>
      <p>Highscore: {highScore}m</p>
      <p>Hitstrength: {hitStrength}</p>
    </div>
  );
};

export default HUD;
