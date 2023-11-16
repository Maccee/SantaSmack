import React, { useEffect, useState } from "react";

// Audio initialized outside the component
const audio = new Audio("wow.mp3");

const Hype = () => {
  const [soundPlayed, setSoundPlayed] = useState(false);

  useEffect(() => {
    const PlayAudio = () => {
      audio.play();
      setSoundPlayed(true); // Mark as played
    };
    PlayAudio();
  }, []); // Depend on ball position and sound played status

  return (
    <>
      <div className="hype">TOP20!</div>
    </>
  );
};

export default Hype;
