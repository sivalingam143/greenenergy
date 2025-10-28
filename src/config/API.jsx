import axios from "axios";
const API_URL = "http://api.demos.srivarugreenenergy.com";
//const API_URL = "https://cors-anywhere.herokuapp.com/http://api.demos.srivarugreenenergy.com";
// const API_URL =("https://cors-anywhere.herokuapp.com/http://api.srivarugreenenergy.com");
// const API_URL = "http://localhost/admin_srivaru/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
// /http://api.srivarugreenenergy.com
// https://cors-anywhere.herokuapp.com/http://api.srivarugreenenergy.com;
