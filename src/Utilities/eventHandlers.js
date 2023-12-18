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
    if (dailyChallengeDistance > 0) {
      const handleKeyDown = (event) => {
        keySequence.push(event.key);
        keySequenceString = keySequence
          .slice(-secretCode.length)
          .join("")
          .toLowerCase();
        if (keySequenceString === secretCode) {
          setJuhaMode((prevMode) => {
            console.log("JuhaMode", !prevMode);
            return !prevMode;
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
      }

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
        let dailyOneNameData = {};

        dailyResult.forEach((score) => {
          let difference = Math.abs(score.distance - dailyChallengeDistance);

          if (
            !dailyOneNameData[score.name] ||
            dailyOneNameData[score.name].difference > difference
          ) {
            dailyOneNameData[score.name] = { ...score, difference };
          }
        });

        let dailyDataArray = Object.values(dailyOneNameData)
          .sort((a, b) => a.difference - b.difference)
          .slice(0, 5);
        setDailyChallengeData(dailyDataArray);
      });

      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [dailyChallengeDistance]);
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
  let dayOfWeek = nowUtc.getUTCDay();
  let difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  nowUtc.setUTCDate(nowUtc.getUTCDate() + difference);
  nowUtc.setUTCHours(0, 0, 0, 0);
  return nowUtc;
}

export function filterDataForWeek(data) {
  const lastMonday = getLastMondayInUTC();
  return data.filter((item) => {
    const itemDateUtc = new Date(item.dateTime + "Z");

    return itemDateUtc >= lastMonday && itemDateUtc <= new Date();
  });
}

export function filterDataForDay(data) {
  const lastMonday = getLastDayInUTC();
  return data.filter((item) => {
    const itemDateUtc = new Date(item.dateTime + "Z");

    return itemDateUtc >= lastMonday && itemDateUtc <= new Date();
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
  nowUtc.setUTCHours(0, 0, 0, 0);
  return nowUtc;
}

export function generateSeedFromDate(date) {
  var seedStr =
    date.getUTCFullYear().toString() +
    (date.getUTCMonth() + 1).toString().padStart(2, "0") +
    date.getUTCDate().toString().padStart(2, "0");
  var seed = parseInt(seedStr);
  return seed;
}
export function seededRandom(min, max, seed) {
  var x = Math.sin(seed++) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
}
