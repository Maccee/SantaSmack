const Background = ({ scrollLeft }) => {
  return (
    <>
      <div
        className="background"
        style={{ transform: `translateX(-${scrollLeft / 5}px)` }}
      ></div>
      <div
        className="background2"
        style={{ transform: `translateX(-${scrollLeft / 10}px)` }}
      ></div>
    </>
  );
};

export default Background;
