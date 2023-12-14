import axios from "../axios";

export const fetchSources = () => {
  return axios.get("sources");
};

export const fetchAuthors = () => {
  return axios.get("author");
};

export const fetchCategories = () => {
  return axios.get("categories");
};
