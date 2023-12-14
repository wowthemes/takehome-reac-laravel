import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";

const AuthRoute = ({ children }) => {
  const {
    globalState: { isUserLoggedIn },
  } = useContext(GlobalContext);

  return isUserLoggedIn ? children : <Navigate to={"/"} replace />;
};

export default AuthRoute;
