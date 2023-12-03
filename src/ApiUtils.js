// ApiUtils.js

import axios from "axios"; // If you're using axios for HTTP requests

const hashData = (data) => {
  return CryptoJS.SHA256(JSON.stringify(data)).toString();
};

const AZURE_FUNCTION_URL =
  "https://joulupeliapi.azurewebsites.net/api/highscore?"; // Replace with your actual Azure Function URL

// Function to post data to Azure Function App
const postDataToAzureFunction = async (data) => {
  try {
    const hashedData = hashData(data);
    const response = await axios.post(AZURE_FUNCTION_URL, { data, hashedData });
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

    return data;
  } catch (error) {
    console.error("Error getting or sorting data from Azure Function:", error);
    return [];
  }
};

export { postDataToAzureFunction, getDataFromAzureFunction };
