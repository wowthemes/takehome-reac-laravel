import React, { useContext, useLayoutEffect, useRef } from "react";
import "./App.css";
import { useRoutes } from "react-router-dom";
import ErrorPage from "./shared/components/ErrorPage";
import LoginSignupForm from "./component/SingnupForm/LoginSignupForm";
import { CHANGE_PASSWORD, LOGIN, SIGNUP } from "./shared/constants/constant";
import AuthRoute from "./shared/components/AuthRoute";
import { GlobalContext } from "./context/GlobalContext";
import { Navigate } from "react-router-dom";
import HomePage from "./component/HomePage/HomePage";
import Preferences from "./component/PreferencesForm/Preferences";
import { fetchArticals } from "./api/Articals/articals";
import { toast } from "./shared/helperFunc/toast";
import {
  fetchAuthors,
  fetchCategories,
  fetchSources,
} from "./api/Filters/filters";
import {
  modifiedFiltersData,
  modifyArticalData,
} from "./shared/helperFunc/utils";

function App() {
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  const {
    globalState: { isUserLoggedIn },
    setArticals,
    setSources,
    setAuthors,
    setCategories,
    setLoadingOverlay,
  } = useContext(GlobalContext);

  const fetchData = () => {
    Promise.all([fetchSources(), fetchCategories(), fetchAuthors()])
      .then((res) => {
        let sourceData = modifiedFiltersData(res[0].data.data);
        let categoryData = modifiedFiltersData(res[1].data.data);
        let authorData = modifiedFiltersData(res[2].data.data);
        setSources(sourceData);
        setCategories(categoryData);
        setAuthors(authorData);
        return [sourceData, categoryData, authorData];
      })
      .then((data) => {
        const [sourceData, categoryData, authorData] = data;
        fetchArticals()
          .then((res) => {
            let resData = res.data.data;
            let updatedData = modifyArticalData({
              resData,
              sourceData,
              categoryData,
              authorData,
            });
            setArticals(updatedData);
            setLoadingOverlay(false);
          })
          .catch((error) => {
            setLoadingOverlay(false);
            toast(error.error, "error", " APP component");
          });
      })
      .catch((error) => {
        setLoadingOverlay(false);
        console.log("error ", error.error);
        toast("Error while fetching filters", "error");
      });
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);
  let element = useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: !isUserLoggedIn ? (
        <LoginSignupForm type={LOGIN} />
      ) : (
        <Navigate to={"/"} replace />
      ),
    },
    {
      path: "/signup",
      element: !isUserLoggedIn ? (
        <LoginSignupForm type={SIGNUP} />
      ) : (
        <Navigate to={"/"} replace />
      ),
    },
    {
      path: "/change-password",
      element: <LoginSignupForm type={CHANGE_PASSWORD} />,
    },
    {
      path: "/preferences",

      element: (
        <AuthRoute>
          <Preferences />
        </AuthRoute>
      ),
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return (
    <div
      style={{
        height: `${Number(windowSize.current[1]) - 68}px`,
      }}
    >
      {element}
    </div>
  );
}

export default App;
