// Utils.js
export const calculateHitStrength = (reactionTime, minReactionTime, maxReactionTime, minHitStrength, maxHitStrength) => {
    const clampedReactionTime = Math.min(
      Math.max(reactionTime, minReactionTime),
      maxReactionTime
    );
    const normalizedTime =
      (clampedReactionTime - minReactionTime) /
      (maxReactionTime - minReactionTime);
    const hitStrength =
      maxHitStrength - normalizedTime * (maxHitStrength - minHitStrength);
    
    return hitStrength;
};

export const resetGame = (
    setHitAngle, 
    setIsHit, 
    setLastHitPosition, 
    setScrollLeft, 
    setIsSpinning, 
    setHitboxEntryTime, 
    setHitboxExitTime, 
    setDistance, 
    setBallPosition, 
    ballPositionRef, 
    verticalVelocityRef, 
    horizontalVelocityRef, 
    bottomLimit
  ) => {
    const resetTop = bottomLimit - 250;
    const resetLeft = 100;
  
    setHitAngle(0);
    setIsHit(false);
    setLastHitPosition({ top: 0, left: 0 });
    setScrollLeft(0);
    setIsSpinning(false);
    setHitboxEntryTime(null);
    setHitboxExitTime(null);
    setDistance(0);
    setBallPosition({
      top: resetTop,
      left: resetLeft,
    });
  
    // Update refs
    ballPositionRef.current = {
      top: resetTop,
      left: resetLeft,
    };
    verticalVelocityRef.current = -7;
    horizontalVelocityRef.current = 0;
  };
  