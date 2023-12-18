import axios from "axios";

const hashData = (data) => {
  return CryptoJS.SHA256(JSON.stringify(data)).toString();
};

const AZURE_FUNCTION_URL =
  "https://joulupeliapi.azurewebsites.net/api/highscore?";

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
