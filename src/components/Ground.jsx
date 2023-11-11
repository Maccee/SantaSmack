const Ground = ({ gameAreaHeight, gameAreaWidth }) => {
    const groundStyle = {
        top: `${gameAreaHeight}px`,
        width: `${gameAreaWidth}px`,
    };
    return (
        <div className="ground" style={groundStyle}></div>
    );
};
export default Ground;
