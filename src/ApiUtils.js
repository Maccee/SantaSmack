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

    return data.sort((a, b) => b.distance - a.distance);
  } catch (error) {
    console.error("Error getting or sorting data from Azure Function:", error);
    // Handle the error appropriately here
    // For instance, you might want to return an empty array if there's an error
    return []; // Or re-throw a custom error, or handle it some other way
  }
};

export { postDataToAzureFunction, getDataFromAzureFunction };
