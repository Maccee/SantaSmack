// ApiUtils.js
import axios from 'axios'; // If you're using axios for HTTP requests

const AZURE_FUNCTION_URL = 'https://joulupeliapi.azurewebsites.net/api/highscore?'; // Replace with your actual Azure Function URL

// Function to post data to Azure Function App
const postDataToAzureFunction = async (data) => {
  try {
    const response = await axios.post(AZURE_FUNCTION_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data to Azure Function:', error);
    throw error;
  }
};

// Function to get data from Azure Function App
const getDataFromAzureFunction = async () => {
    try {
      const response = await axios.get(AZURE_FUNCTION_URL);
      return response.data;
    } catch (error) {
      console.error('Error getting data from Azure Function:', error);
      throw error;
    }
  };
  
  export { postDataToAzureFunction, getDataFromAzureFunction };
  
