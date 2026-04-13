import axios from 'axios';

// Use environment variables or default to local microservice ports
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5001/api/auth';
const INTERVIEW_API_URL = import.meta.env.VITE_INTERVIEW_API_URL || 'http://localhost:5002/api/interview';

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/register`, userData);
    return response.data;
  } catch (error) {    
    console.log(error);
    throw new Error(error.response ? error.response.data.message : error.message);
  }
};

// Function to login a user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : error.message);
  }
};

export const results = async () => {
  try {
    const response = await axios.get(`${INTERVIEW_API_URL}/results`,{headers:{"authorization":JSON.parse(localStorage.getItem("loggedinuser"))}}); 
    return response.data; 
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

export const gemini = async(prompt)=>{
  try {
    const response = await axios.post(`${INTERVIEW_API_URL}/gemini`,prompt,{headers:{"authorization":JSON.parse(localStorage.getItem("loggedinuser"))}}); 
    return response.data; 
  } catch (error) {
    console.error("Error in fetching gemini questions", error);
    return [];
  }
}

export const chat = async(prompt)=>{
  try {
    const response = await axios.post(`${INTERVIEW_API_URL}/chat`,prompt,{headers:{"authorization":JSON.parse(localStorage.getItem("loggedinuser"))}}); 
    return response.data; 
  } catch (error) {
    console.error("Error in saving chat", error);
    return [];
  }
}
