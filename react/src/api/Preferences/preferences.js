import axios from "../axios";

export const postPreferences = async (data) => {
  return await axios.post("user-preference", data);
};

export const getPreferences = async (data) => {
  return await axios.get("preference", data);
};
