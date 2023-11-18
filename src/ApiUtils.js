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

    // Add a property to each entry for the difference
    data.forEach(entry => {
      entry.difference = Math.abs(entry.distance - dailyChallengeDistance);
    });

    // Sort the array by the difference in ascending order and slice the top 5
    const closestEntries = data.sort((a, b) => a.difference - b.difference).slice(0, 5);

    // Map the closestEntries to return an array of objects with name and distance
    return closestEntries.map(entry => ({ name: entry.name, distance: entry.distance }));
  } catch (error) {
    console.error("Error getting data from Azure Function:", error);
    return []; // Return an empty array or handle the error as needed
  }
};



export { postDataToAzureFunction, getDataFromAzureFunction, getClosestDistanceFromAzureFunction };
