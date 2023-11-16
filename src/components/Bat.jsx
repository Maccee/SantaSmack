const Bat = ({ isHit, gameAreaHeight }) => {
  const batStyle = {
    top: `${gameAreaHeight - 130}px`,
    left: "0px",
  };
  const batClass = isHit ? "bat hit" : "bat";
  return <div className={batClass} style={batStyle} />;
};
export default Bat;
