import SantaImg from "../assets/pukki.png";
import Bat from "./Bat";

const Santa = ({
    showHitbox,
    hitboxTopBoundary,
    hitboxBottomBoundary,
    bottomLimit,
    isHit,
    gameAreaHeight
}) => {
    const santaStyle = {
        top: `${bottomLimit +10}px`,
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
            <Bat isHit={isHit} gameAreaHeight={gameAreaHeight} />
        </div>
    );
};

export default Santa;