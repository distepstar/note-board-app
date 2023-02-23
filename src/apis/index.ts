import axios from "axios";
import { apiBaseURI } from "../constants/apis";

export const appApiClient = axios.create({
  baseURL: apiBaseURI,
  headers: {
    "Content-Type": "application/json",
  }
})
