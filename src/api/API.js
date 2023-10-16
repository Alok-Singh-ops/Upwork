import axios from "axios";

const API = axios.create({
  baseURL: "http://13.231.17.170:8080",
});

export default API;
