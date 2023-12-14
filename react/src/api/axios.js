import axios from "axios";
import { clearUserInfo } from "../shared/helperFunc/utils";
import { LOGGEDIN_USER } from "../shared/constants/constant";
import { toast } from "../shared/helperFunc/toast";

const axiosConfig = {
  baseURL: "http://127.0.0.1:8000/api/", // Local
};

// Create Default Axios Instance
const instance = axios.create(axiosConfig);

// Create Default Axios Instance for actions without Interceptors
const instanceWithoutInterceptors = axios.create(axiosConfig);

// set Common header for without authorization issue....
instanceWithoutInterceptors.interceptors.request.use((config) => {
  // Add common request header
  config.headers["Accept-Language"] = "en"; // Content Accept Language
  return config;
});

// Set ID-token as an authorization header for all request when its exists
instance.interceptors.request.use((config) => {
  // Get user info
  const userToken = JSON.parse(localStorage.getItem(LOGGEDIN_USER))?.token;
  // If userInfo
  if (userToken) {
    config.headers["Authorization"] = `Bearer ${userToken}`; // fetch idToken
  }

  return config;
});

// Add interceptors for validate authorization
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    toast(error.response.data.message, "error");

    if (error.response.status === 401) {
      clearUserInfo();
      return;
    }
    return Promise.reject(new Error(error));
  }
);

// Export Axios with Auth Headers
export default instance;

// Export Axios Without instance
export { instanceWithoutInterceptors as axiosWI };
