import axios from "axios";

export const appApiClient = axios.create({
  baseURL: "http://localhost:5510/api",
  headers: {
    "Content-Type": "application/json",
  }
})
