const distanceMusa = new Audio("distancemusic.mp3");
let isFadingOut = false;
let fadeOutInterval = null;

export const distanceMusicPlay = (horizontalVelocityRef, mute) => {
  if (mute) {
    stopMusic();
    return;
  }

  if (isFadingOut) {
    return;
  }

  if (horizontalVelocityRef.current > 27 && !distanceMusa.playing) {
    playForFiveSeconds(horizontalVelocityRef);
  }
};

const playForFiveSeconds = (horizontalVelocityRef) => {
  distanceMusa.volume = 1;
  distanceMusa.play();
  

  setTimeout(() => {
    if (!isFadingOut) {
      checkVelocityAndDecide(horizontalVelocityRef);
    }
  }, 1000);
};

const checkVelocityAndDecide = (horizontalVelocityRef) => {
    
  if (horizontalVelocityRef.current > 17) {
    console.log("PLaying", horizontalVelocityRef.current)
    playForFiveSeconds(horizontalVelocityRef);
  } else {
    console.log("Fadeout", horizontalVelocityRef.current)
    fadeOutMusic(horizontalVelocityRef);
  }
};

const fadeOutMusic = (horizontalVelocityRef) => {
  if (isFadingOut) {
    return;
  }
  isFadingOut = true;
  clearInterval(fadeOutInterval);
  fadeOutInterval = setInterval(() => {
    if (distanceMusa.volume > 0.1) {
      distanceMusa.volume -= 0.1;
      
    } else {
      clearInterval(fadeOutInterval);
      distanceMusa.pause();
      distanceMusa.currentTime = 0;
      isFadingOut = false;
    }
  }, 1000);
  
  setTimeout(() => {
    if (Math.abs(horizontalVelocityRef.current) > 1) {
        console.log("uudestaan", horizontalVelocityRef.current)
    playForFiveSeconds(horizontalVelocityRef)
    }
  }, 1000);
};

const stopMusic = () => {
  clearInterval(fadeOutInterval);
  isFadingOut = false;
  distanceMusa.volume = 0;
  distanceMusa.currentTime = 0;
  distanceMusa.pause();
};
