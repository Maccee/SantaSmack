const Bat = ({ isHit, gameAreaHeight }) => {
  const batStyle = {
    top: `${gameAreaHeight - 200}px`
  };
  const batClass = isHit ? "bat hit" : "bat";
  return <div className={batClass} style={batStyle} />;
};
export default Bat;