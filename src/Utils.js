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

export const defineHitStrength = (juhamode, mute) => {
  const hitStrength = (Math.random() * (55 - 50) + 50).toFixed(2);
  const parsedHitStrength = parseFloat(hitStrength);

  // Play audio if hitStrength is above the threshold
  if (!mute) {
    playAudio(juhamode);
  }
  return parsedHitStrength;
};

const playAudio = (juhamode) => {
  // Default audio file
  let audioFile = "punch.mp3";

  // Array of audio files for juhamode
  const juhamodeFiles = [
    "./iddqd/kympinkahenkympin.mp3",
    "./iddqd/eivarmastimeeohimaalista.mp3",
  ];

  if (juhamode) {
    // If juhamode is true, select a random file from the juhamodeFiles array
    const randomIndex = Math.floor(Math.random() * juhamodeFiles.length);
    audioFile = juhamodeFiles[randomIndex];
  }

  // Play the audio file
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
  setConsecutivePoroHits
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

  setPoroHits(0);
  setConsecutivePoroHits(0);

  // Update refs
  ballPositionRef.current = {
    top: resetTop,
    left: resetLeft,
  };
  verticalVelocityRef.current = -7;
  horizontalVelocityRef.current = 0;
};
