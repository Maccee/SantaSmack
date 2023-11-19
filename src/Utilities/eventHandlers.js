import { useEffect } from "react";
import { getClosestDistanceFromAzureFunction } from "../ApiUtils";

let keySequence = [];
let keySequenceString = "";
const secretCode = "iddqd";

export const useWindowEventHandlers = (horizontalVelocityRef) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        horizontalVelocityRef.current = 0;
      }
    };

    const handleResize = () => {
      horizontalVelocityRef.current = 0;
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [horizontalVelocityRef]);
};

export const useGameInitialization = (
  setJuhaMode,
  toggleHUD,
  gameAreaRef,
  getDataFromAzureFunction,
  setAllTimeData,
  dailyChallengeDistance,
  setDailyChallengeData
) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      keySequence.push(event.key);
      keySequenceString = keySequence
        .slice(-secretCode.length)
        .join("")
        .toLowerCase();
      if (keySequenceString === secretCode) {
        setJuhaMode((prevMode) => {
          console.log("JuhaMode", !prevMode); // Log the new state
          return !prevMode; // This toggles the mode
        });
        keySequence = [];
      }
      if (event.keyCode === 220 || event.keyCode === 192) {
        toggleHUD();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    if (gameAreaRef.current) {
      const element = gameAreaRef.current;
      element.scrollTop = element.scrollHeight - element.clientHeight;
      //gameAreaRef.current.focus();
    }
    getDataFromAzureFunction().then((sortedResult) => {
      setAllTimeData(sortedResult);
    });

    getClosestDistanceFromAzureFunction(dailyChallengeDistance)
      .then((dailyChallengeData) => {
        if (dailyChallengeData) {
          setDailyChallengeData(dailyChallengeData); // Set the entire object
        } else {
          console.log("No matching entry found");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
};
