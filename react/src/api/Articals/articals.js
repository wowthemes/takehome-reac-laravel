import axios from "../axios";

export const fetchArticals = async (queryParams) => {
  return await axios.get("articles", {
    params: {
      ...queryParams,
    },
  });
};
