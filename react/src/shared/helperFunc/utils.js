import { LOGGEDIN_USER } from "../constants/constant";

export const clearUserInfo = () => {
  localStorage.removeItem(LOGGEDIN_USER);
  return true;
};

export const setLoggedinUser = (value) => {
  localStorage.setItem(LOGGEDIN_USER, JSON.stringify(value));
  return true;
};

export const valuesToStore = (value) => {
  let valuesToStore = {
    token: value.data.token,
    user: {
      name: value.data.user.name,
      email: value.data.user.email,
    },
  };
  return valuesToStore;
};

export const modifiedFiltersData = (data) => {
  if (data) {
    let updatedData = data.map((source) => {
      return { label: source.name, value: source.id };
    });
    return updatedData;
  }
  return null;
};

export const modifyArticalData = ({
  resData,
  sourceData,
  categoryData,
  authorData,
}) => {
  if (resData) {
    let artcalData = resData.map((artical) => {
      let source = sourceData
        ? sourceData.find((data) => data.value === artical.source_id)
        : null;
      let category = categoryData
        ? categoryData.find((data) => data.value === artical.category_id)
        : categoryData;
      let author = authorData
        ? authorData.find((data) => data.value === artical.author_id)
        : null;
      artical.source = source ? source.label : null;
      artical.category = category ? category.label : null;
      artical.author = author ? author.label : null;
      return artical;
    });
    return artcalData;
  }
  return null;
};
