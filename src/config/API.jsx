import axios from "axios";
const API_URL = " https://greenenergy.zentexus.in/api;";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
