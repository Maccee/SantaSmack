// Utils.js
export const calculateHitStrength = (
  reactionTime,
  minReactionTime,
  maxReactionTime,
  minHitStrength,
  maxHitStrength
) => {
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

export const defineHitStrength = (juhamode) => {
  const hitStrength = (Math.random() * (75 - 70) + 70).toFixed(2);
  const parsedHitStrength = parseFloat(hitStrength);
  const test = 89;
  // Check if hitStrength is below 50
  if (parsedHitStrength > 60.5) {
    let audio = new Audio("bighit.mp3");
    if (juhamode) {
      audio = new Audio("eivarmastimeeohimaalista.mp3");
    }
    audio.play();
  }

  return parsedHitStrength;
  //return test;
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
