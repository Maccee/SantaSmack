const Background = ({ scrollLeft, gameAreaWidth }) => {
  return (
    <>
      <div
        className="background"
        style={{
          transform: `translateX(-${scrollLeft / 5}px)`,
          width: `${gameAreaWidth}px`,
        }}
      ></div>
      <div
        className="background2"
        style={{
          transform: `translateX(-${scrollLeft / 10}px)`,
          width: `${gameAreaWidth}px`,
        }}
      ></div>
      <div
        className="snow"
        style={{
          transform: `translateX(-${scrollLeft / 3}px)`,
          width: `${gameAreaWidth}px`,
        }}
      ></div>
    </>
  );
};

export default Background;

