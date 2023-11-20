import React, { useEffect, useRef } from "react";

const QuestionMarkPopup = ({ setShowQuestionMarkPopup }) => {
  const ref = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      console.log("Document clicked");
      if (ref.current && !ref.current.contains(e.target)) {
        console.log("Closing popup");
        setShowQuestionMarkPopup(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

  return (
    <div className="questionMarkPopup" ref={ref}>
      <h2>DAILY CHALLENGE</h2>
      <p>Goal is to smack the ball as close to the target.</p>
      <p>
        Ready to take on the challenge? Best of luck, and may your every move
        bring you closer to victory! 💪
      </p>
    </div>
  );
};

export default QuestionMarkPopup;

