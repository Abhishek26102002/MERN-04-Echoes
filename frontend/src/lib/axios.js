import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mern-04-echoes-2.onrender.com",
  withCredentials: true,
});
