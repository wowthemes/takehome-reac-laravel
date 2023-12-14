import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { LOGGEDIN_USER } from "../shared/constants/constant";
import { getPreferences } from "../api/Preferences/preferences";

// Actions
const LOADING_OVERLAY = "LOADING_OVERLAY";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILED = "LOGIN_FAILED";
const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
const SET_ARTICALS = "SET_ARTICALS";
const SET_SOURCES = "SET_SOURCES";
const SET_AUTHORS = "SET_AUTHORS";
const SET_CATEGORIES = "SET_CATEGORIES";
const SET_PREFRENCES = "SET_PREFRENCES";

export const initialState = {
  loadingOverlay: true,
  isUserLoggedIn: false,
  isUserLoggedOut: false,
  loginInfo: "",
  articals: null,
  sources: null,
  authors: null,
  categories: null,
  prefrences: null,
};

const Reducer = (globalState, action) => {
  switch (action.type) {
    case LOADING_OVERLAY:
      if (action.payload === globalState.loadingOverlay) return globalState;
      return {
        ...globalState,
        loadingOverlay: action.payload,
      };
    case LOGIN_SUCCESS:
      return {
        ...globalState,
        loginInfo: action.payload,
        isUserLoggedIn: true,
      };
    case LOGIN_FAILED:
      return {
        ...globalState,
        isUserLoggedIn: false,
      };
    case LOGOUT_SUCCESS:
      return {
        ...globalState,
        loginInfo: "",
        isUserLoggedIn: false,
      };
    case SET_ARTICALS:
      return {
        ...globalState,
        articals: action.payload,
      };
    case SET_SOURCES:
      return {
        ...globalState,
        sources: action.payload,
      };
    case SET_AUTHORS:
      return {
        ...globalState,
        authors: action.payload,
      };
    case SET_CATEGORIES:
      return {
        ...globalState,
        categories: action.payload,
      };
    case SET_PREFRENCES:
      return {
        ...globalState,
        prefrences: action.payload,
      };
    default:
      return globalState;
  }
};

const GlobalState = ({ children, defaultInitialState = {} }) => {
  const [globalState, dispatch] = useReducer(Reducer, {
    ...initialState,
    ...defaultInitialState,
  });

  const clearUserData = () => {
    localStorage.setItem(LOGGEDIN_USER, JSON.stringify(""));
  };

  const setLoadingOverlay = useCallback((value) => {
    dispatch({ type: LOADING_OVERLAY, payload: value });
  }, []);

  // Logout user
  const logoutCurrentUser = useCallback(() => {
    dispatch({ type: LOGOUT_SUCCESS });
  }, []);

  const handleLogout = useCallback(() => {
    clearUserData();
    logoutCurrentUser();
  }, []);

  const setUserLoginInfo = useCallback((value) => {
    dispatch({ type: LOGIN_SUCCESS, payload: value });
  }, []);

  const setLoginFailed = useCallback((value) => {
    dispatch({ type: LOGIN_FAILED, payload: value });
  }, []);

  const setArticals = useCallback((value) => {
    dispatch({ type: SET_ARTICALS, payload: value });
  }, []);

  const setSources = useCallback((value) => {
    dispatch({ type: SET_SOURCES, payload: value });
  }, []);

  const setAuthors = useCallback((value) => {
    dispatch({ type: SET_AUTHORS, payload: value });
  }, []);

  const setCategories = useCallback((value) => {
    dispatch({ type: SET_CATEGORIES, payload: value });
  }, []);

  const setPrefrences = useCallback((value) => {
    dispatch({ type: SET_PREFRENCES, payload: value });
  }, []);

  useEffect(() => {
    const user = localStorage.getItem(LOGGEDIN_USER);
    if (user) {
      const parseData = JSON.parse(user);
      setUserLoginInfo(parseData);
    }
  }, []);

  useEffect(() => {
    if (globalState.isUserLoggedIn) {
      getPreferences().then((res) => {
        let data = res.data.data.length > 0 ? res.data.data[0] : null;
        if (data) {
          let updatedPreferences = {
            author_id: data.author.id,
            category_id: data.category.id,
            source_id: data.source.id,
            date_from: data.date_from,
            date_to: data.date_to,
          };
          setPrefrences(updatedPreferences);
        }
      });
    }
  }, [globalState.isUserLoggedIn]);

  const contextValue = useMemo(
    () => ({
      globalState,
      setLoadingOverlay,
      handleLogout,
      setUserLoginInfo,
      setLoginFailed,
      setArticals,
      setSources,
      setAuthors,
      setCategories,
      setPrefrences,
    }),
    [globalState]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const GlobalContext = createContext(initialState);

export default GlobalState;
