// ApiUtils.js
import axios from "axios"; // If you're using axios for HTTP requests

const AZURE_FUNCTION_URL =
  "https://joulupeliapi.azurewebsites.net/api/highscore?"; // Replace with your actual Azure Function URL

// Function to post data to Azure Function App
const postDataToAzureFunction = async (data) => {
  try {
    const response = await axios.post(AZURE_FUNCTION_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data to Azure Function:", error);
    throw error;
  }
};

// Function to get data from Azure Function App
const getDataFromAzureFunction = async () => {
  try {
    const response = await axios.get(AZURE_FUNCTION_URL);
    const data = response.data;

    if (!Array.isArray(data)) {
      throw new Error("The fetched data is not an array.");
    }

    // Sort the data and then slice the top 20
    //const sortedData = data.sort((a, b) => b.distance - a.distance).slice(0, 20);

    return data;
  } catch (error) {
    console.error("Error getting or sorting data from Azure Function:", error);
    return []; // Return an empty array or handle the error as needed
  }
};

const getClosestDistanceFromAzureFunction = async (dailyChallengeDistance) => {
  try {
    const response = await axios.get(AZURE_FUNCTION_URL);
    const data = response.data;

    if (!Array.isArray(data)) {
      throw new Error("The fetched data is not an array.");
    }

    let closestEntry = null;
    let smallestDifference = Infinity;

    data.forEach(entry => {
      const difference = Math.abs(entry.distance - dailyChallengeDistance);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestEntry = entry;
      }
    });

    return closestEntry ? { name: closestEntry.name, distance: closestEntry.distance } : null;
  } catch (error) {
    console.error("Error getting data from Azure Function:", error);
    return null; // Return null or handle the error as needed
  }
};



export { postDataToAzureFunction, getDataFromAzureFunction, getClosestDistanceFromAzureFunction };
