const HUD = ({
  showHUD,
  lastHitPosition,
  ballPosition,
  hitAngle,
  horizontalVelocity,
  verticalVelocity,
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
        Last Hit Position: {lastHitPosition.top.toFixed(0)}px from top,
        {lastHitPosition.left.toFixed(0)}px from left
      </p>
      <p>Ball Position: {ballPosition.top.toFixed(0)}px</p>
      <p>Hit Angle: {hitAngle.toFixed(0)}°</p>
      <p>Horizontal Velocity: {horizontalVelocity.toFixed(2)}px/frame</p>
      <p>Vertical Velocity: {verticalVelocity.toFixed(2)}px/frame</p>
      <p>Distance Right: {ballPosition.left.toFixed(0)}px</p>
      <p>Distance meters: {distance}</p>
      <p>Bottom: {bottomLimit}</p>
      <p>IsHit: {isHit ? "true" : "false"}</p>
      <button onClick={toggleShowHitbox}>Display Hitbox</button>
      <p>Highscore: {highScore}m</p>
      <p>{hitStrength}</p>
    </div>
  );
};

export default HUD;
