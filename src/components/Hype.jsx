import React, { useEffect, useState } from "react";


const audio = new Audio("wow.mp3");

const Hype = ({ mute }) => {
  const [soundPlayed, setSoundPlayed] = useState(false);

  useEffect(() => {
    const playAudio = () => {
      audio.play();
      setSoundPlayed(true); 
    };

    if (!mute && !soundPlayed) {
      playAudio();
    }
  }, [ mute, soundPlayed]);

  return (
    <>
      <div className="hype">WOW</div>
    </>
  );
};

export default Hype;
