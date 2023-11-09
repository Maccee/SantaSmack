const Ground = ({ gameAreaHeight }) => {
    const groundStyle = {
        top: `${gameAreaHeight}px`
    };
    return (
        <div className="ground" style={groundStyle}></div>
    );
};
export default Ground;
