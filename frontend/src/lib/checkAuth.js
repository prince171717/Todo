import { axiosInstance } from "./axios";

export const checkAuth = async () => {
  try {
    const res = await axiosInstance.get("/api/checkauth");
    console.log(res.data);
    return { authenticated: res.data.authenticated, userData: res.data.user };
  } catch (error) {
    console.log("Error in checkAuth frontend", error.message);
    return { authenticated: false, userData: null };
  }
};

