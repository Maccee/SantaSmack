const Ground = ({ gameAreaHeight }) => {
    // Ensure gameAreaHeight is a number and append 'px' for valid CSS value
    const groundStyle = {
        top: `${gameAreaHeight}px`

    };
console.log(gameAreaHeight)
    return (
        <div className="ground" style={groundStyle}></div>
    );
};

export default Ground;
