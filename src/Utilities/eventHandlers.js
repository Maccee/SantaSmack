import { useEffect } from "react";

let keySequence = [];
let keySequenceString = "";
const secretCode = "iddqd";

export const useWindowEventHandlers = (setResized) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setResized(true);
      }
    };

    const handleResize = () => {
      setResized(true);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
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

    // ON REFRESH
    getDataFromAzureFunction().then((result) => {
      // ALLTIME TOP20
      const onlyOneNameData = {};
      result.forEach((item) => {
        if (
          !onlyOneNameData[item.name] ||
          onlyOneNameData[item.name] < item.distance
        ) {
          onlyOneNameData[item.name] = item.distance;
        }
      });
      const dataArray = Object.keys(onlyOneNameData).map((name) => {
        return { name, distance: onlyOneNameData[name] };
      });
      const top20ByDistance = dataArray
        .sort((a, b) => b.distance - a.distance)
        .slice(0, 20);
      setAllTimeData(top20ByDistance);

      // WEEKLY TOP20
      let weeklyResult = filterDataForWeek(result);
      const weeklyOneNameData = {};

      weeklyResult.forEach((item) => {
        if (
          !weeklyOneNameData[item.name] ||
          weeklyOneNameData[item.name] < item.distance
        ) {
          weeklyOneNameData[item.name] = item.distance;
        }
      });

      const weeklyDataArray = Object.keys(weeklyOneNameData).map((name) => {
        return { name, distance: weeklyOneNameData[name] };
      });

      const top20WeeklyByDistance = weeklyDataArray
        .sort((a, b) => b.distance - a.distance)
        .slice(0, 20);

      setWeeklyData(top20WeeklyByDistance);

      // DAILY CHALLENGE TOP5
      let dailyResult = filterDataForDay(result);

      const dailyOneNameData = {};
      dailyResult.forEach((score) => {
        const difference = Math.abs(score.distance - dailyChallengeDistance);
        if (
          !dailyOneNameData[score.name] ||
          dailyOneNameData[score.name].difference > difference
        ) {
          dailyOneNameData[score.name] = { ...score, difference };
        }
      });

      const dailyDataArray = Object.values(dailyOneNameData)
        .sort((a, b) => a.difference - b.difference)
        .slice(0, 5);

      setDailyChallengeData(dailyDataArray);
      

    });

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
};

function getLastMondayInUTC() {
  const nowUtc = new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      new Date().getUTCHours(),
      new Date().getUTCMinutes(),
      new Date().getUTCSeconds()
    )
  );
  let dayOfWeek = nowUtc.getUTCDay(); // Sunday - 0, Monday - 1, etc.
  let difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If it's Sunday in UTC, go back 6 days, else go to the last Monday
  nowUtc.setUTCDate(nowUtc.getUTCDate() + difference);
  nowUtc.setUTCHours(0, 0, 0, 0); // Set to start of the day (00:00:00)
  return nowUtc;
}

// Function to filter data from last Monday to current time
export function filterDataForWeek(data) {
  const lastMonday = getLastMondayInUTC();
  return data.filter((item) => {
    // Add 'Z' to indicate UTC time
    const itemDateUtc = new Date(item.dateTime + "Z");

    return itemDateUtc >= lastMonday && itemDateUtc <= new Date(); // Checks if the date falls in the current week
  });
}

// Function to filter data from last day to current time
export function filterDataForDay(data) {
  
  const lastMonday = getLastDayInUTC();
  return data.filter((item) => {
    // Add 'Z' to indicate UTC time
    const itemDateUtc = new Date(item.dateTime + "Z");

    return itemDateUtc >= lastMonday && itemDateUtc <= new Date(); // Checks if the date falls in the current day
  });
}
function getLastDayInUTC() {
  const nowUtc = new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate()
    )
  );
  nowUtc.setUTCHours(0, 0, 0, 0); // Set to start of the day (00:00:00)
  return nowUtc;
}
