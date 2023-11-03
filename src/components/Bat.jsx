const Bat = ({ isHit }) => {
  // When isHit is true the bat animates to swing. When false, reset.
  const batClass = isHit ? "bat hit" : "bat";
  return <div className={batClass} />;
};

export default Bat;