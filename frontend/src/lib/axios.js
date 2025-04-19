import axios from "axios";
import { handleError } from "./utils";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:1234",
  withCredentials: true,
});

// ✅ Global response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;

    if (
      error.response?.status === 401 &&
      message === "Password changed recently. Please log in again."
    ) {
      handleError("Your password was changed. Please log in again.");
      // 🔐 Auto logout actions
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("loggedInUser");

      // 🔁 Redirect to login page
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // small delay to show toast
    }

    return Promise.reject(error);
  }
);
