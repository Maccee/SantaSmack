// OrientationWarning.jsx

import React, { useEffect, useState } from "react";

const OrientationWarning = () => {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      // Check if the device is in landscape mode
      setIsLandscape(window.orientation === 90 || window.orientation === -90);
    };

    // Initial check on component mount
    handleOrientationChange();

    // Add event listener for orientation change
    window.addEventListener("orientationchange", handleOrientationChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return isLandscape ? (
    <div className="orientation-warning-container">
      <div className="orientation-warning-content">
        <p>Please rotate your device to portrait mode.</p>
      </div>
    </div>
  ) : null;
};

export default OrientationWarning;
