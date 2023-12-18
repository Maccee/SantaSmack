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

export const defineHitStrength = (juhamode, mute) => {
  const hitStrength = (Math.random() * (55 - 50) + 50).toFixed(2);
  const parsedHitStrength = parseFloat(hitStrength);
  const test = 150;

  if (!mute) {
    playAudio(juhamode);
  }
  //return test;
  return parsedHitStrength;
};

const playAudio = (juhamode) => {
  let audioFile = "punch.mp3";

  const juhamodeFiles = [
    "./iddqd/kympinkahenkympin.mp3",
    "./iddqd/eivarmastimeeohimaalista.mp3",
  ];

  if (juhamode) {
    const randomIndex = Math.floor(Math.random() * juhamodeFiles.length);
    audioFile = juhamodeFiles[randomIndex];
  }

  const audio = new Audio(audioFile);
  audio.play();
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
  bottomLimit,
  setPoroHitCounter,
  setPoroHits,
  setConsecutivePoroHits,
  setResized
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

  setResized(false);

  setPoroHits(0);
  setConsecutivePoroHits(0);

  ballPositionRef.current = {
    top: resetTop,
    left: resetLeft,
  };
  verticalVelocityRef.current = -7;
  horizontalVelocityRef.current = 0;
};
