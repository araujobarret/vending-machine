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
          // Seed Token
          colorPrimary: "#1f6ae3",
          borderRadius: 2,

          // Alias Token
          colorBgContainer: "#f0f0f0",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
