import React, { useEffect, useState } from "react";

// Audio initialized outside the component
const audio = new Audio("wow.mp3");

const Hype = ({ mute }) => {
  const [soundPlayed, setSoundPlayed] = useState(false);

  useEffect(() => {
    const playAudio = () => {
      audio.play();
      setSoundPlayed(true); // Mark as played
    };

    if (!mute && !soundPlayed) {
      playAudio();
    }
  }, [ mute, soundPlayed]); // Depend on these props and state

  return (
    <>
      <div className="hype">TOP20!</div>
    </>
  );
};

export default Hype;
