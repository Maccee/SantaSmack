const Hype = ({ ballPositionRef }) => {
    return (
      <>
        {ballPositionRef.current.left > 10000 && (
          <div className="hype">
            WAU!
          </div>
        )}
      </>
    );
  };
  
  export default Hype;
  