import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1f6ae3",
          borderRadius: 2,
          colorBgContainer: "#e3e3e3",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
