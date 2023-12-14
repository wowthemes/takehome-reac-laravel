import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Layout } from "antd";
import CustomHeader from "./shared/components/Header";
import { BrowserRouter } from "react-router-dom";
// import 'antd/dist/antd.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
const GlobalState = lazy(() => import("./context/GlobalContext"));

root.render(
  // <React.StrictMode>
  <Layout className="layout" style={{ overflow: "hidden" }}>
    <BrowserRouter>
      <GlobalState>
        <CustomHeader />
        <App />
      </GlobalState>
    </BrowserRouter>
  </Layout>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
