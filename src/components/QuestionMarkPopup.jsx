import React, { useEffect, useRef } from "react";

const QuestionMarkPopup = ({ isOpen, closePopup }) => {
  const ref = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isOpen, closePopup]);

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
