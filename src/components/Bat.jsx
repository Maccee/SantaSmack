const Bat = ({ isHit, gameAreaHeight }) => {
  const batStyle = {
    top: `${gameAreaHeight - 140}px`,
    left: "20px",
  };
  const batClass = isHit ? "bat hit" : "bat";
  return <div className={batClass} style={batStyle} />;
};
export default Bat;
