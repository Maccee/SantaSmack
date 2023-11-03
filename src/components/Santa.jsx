import SantaImg from "../assets/pukki.png";

const Santa = ({
    showHitbox,
    hitboxTopBoundary,
    hitboxBottomBoundary,
    bottomLimit,
}) => {
    const santaStyle = {
        top: `${bottomLimit + 23}px`,
        left: "0px",
    };

    const hitboxStyle = {
        position: "absolute",
        top: `${hitboxTopBoundary}px`,
        left: "0px",
        width: "200px",
        height: `${hitboxBottomBoundary - hitboxTopBoundary}px`,
        backgroundColor: "rgba(255,0,0,0.3)",
        display: showHitbox ? "block" : "none",
    };

    return (
        <div>
            <div className="santa" style={santaStyle}>
                <img src={SantaImg} alt="Santa" />
            </div>
            <div style={hitboxStyle}></div>
        </div>
    );
};

export default Santa;