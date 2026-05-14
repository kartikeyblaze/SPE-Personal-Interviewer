import axios from 'axios';

// Use relative paths to be routed by the Nginx API Gateway
const AUTH_API_URL = '/api/auth';
const INTERVIEW_API_URL = '/api/interview';
const REQUEST_TIMEOUT_MS = 35000;

const api = axios.create({ timeout: REQUEST_TIMEOUT_MS });

const authHeaders = () => ({
  authorization: JSON.parse(localStorage.getItem("loggedinuser"))
});

const apiErrorMessage = (error, fallback) => {
  if (error.code === "ECONNABORTED") {
    return "The interview service timed out. Please try again.";
  }
  return error.response?.data?.error || error.response?.data?.message || error.message || fallback;
};

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post(`${AUTH_API_URL}/register`, userData);
    return response.data;
  } catch (error) {    
    console.log(error);
    throw new Error(error.response ? error.response.data.message : error.message);
  }
};

// Function to login a user
export const loginUser = async (userData) => {
  try {
    const response = await api.post(`${AUTH_API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : error.message);
  }
};

export const results = async () => {
  try {
    const response = await api.get(`${INTERVIEW_API_URL}/results`, { headers: authHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

export const gemini = async(prompt)=>{
  try {
    const response = await api.post(`${INTERVIEW_API_URL}/gemini`, prompt, { headers: authHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error in fetching gemini questions", error);
    throw new Error(apiErrorMessage(error, "Failed to generate interview questions."));
  }
}

export const chat = async(prompt)=>{
  try {
    const response = await api.post(`${INTERVIEW_API_URL}/chat`, prompt, { headers: authHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error in saving chat", error);
    return [];
  }
}
