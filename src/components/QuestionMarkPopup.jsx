import React, { useEffect, useRef, useState } from "react";
import QuestionMarkImg from "../assets/questionmark.webp";

const QuestionMarkPopup = () => {
  const [showQuestionMarkPopup, setShowQuestionMarkPopup] = useState(false);

  const ref = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowQuestionMarkPopup((prev) => !prev);
      }
    };
    document.addEventListener("click", checkIfClickedOutside);
    return () => {
      document.removeEventListener("click", checkIfClickedOutside);
    };
  }, []);

  return (
    <>
      <button
        className="questionMarkButton"
        onClick={(event) => {
          event.stopPropagation();
          setShowQuestionMarkPopup((prev) => !prev);
        }}
      >
        <img src={QuestionMarkImg} alt="question mark" />
      </button>
      {showQuestionMarkPopup && (
        <div className="questionMarkPopup" ref={ref}>
          <h2>DAILY CHALLENGE</h2>
          <p>Goal is to smack the ball as close to the target.</p>
          <p>
            Ready to take on the challenge? Best of luck, and may your every
            move bring you closer to victory! 💪
          </p>
        </div>
      )}
    </>
  );
};

export default QuestionMarkPopup;
