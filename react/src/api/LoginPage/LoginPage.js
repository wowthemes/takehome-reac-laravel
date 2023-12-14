import axios from "../axios";

export const Login = async (data) => {
  return await axios.post("login", data);
};

export const Register = async (data) => {
  return await axios.post("register", data);
};
