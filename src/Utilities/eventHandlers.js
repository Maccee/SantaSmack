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
  setWeeklyData,
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
    getDataFromAzureFunction().then((result) => {
      setAllTimeData(result);
      let weeklyData = filterDataForWeek(result);
      setWeeklyData(weeklyData);
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

export function getLastMondayInUTC() {
  const nowUtc = new Date(Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate(),
    new Date().getUTCHours(),
    new Date().getUTCMinutes(),
    new Date().getUTCSeconds()
  ));
  let dayOfWeek = nowUtc.getUTCDay(); // Sunday - 0, Monday - 1, etc.
  let difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If it's Sunday in UTC, go back 6 days, else go to the last Monday
  nowUtc.setUTCDate(nowUtc.getUTCDate() + difference);
  nowUtc.setUTCHours(0, 0, 0, 0); // Set to start of the day (00:00:00)
  return nowUtc;
}

// Function to filter data from last Monday to current time
export function filterDataForWeek(data) {
  const lastMonday = getLastMondayInUTC();
  return data.filter(item => {
    // Add 'Z' to indicate UTC time
    const itemDateUtc = new Date(item.dateTime + 'Z');
   
    return itemDateUtc >= lastMonday && itemDateUtc <= new Date(); // Checks if the date falls in the current week
  });
}


