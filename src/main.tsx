import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store";
import "./i18n";
import "./index.scss";

console.log("version", import.meta.env.VITE_VERSION);
//console.log("env", import.meta.env);

const mocking = false;
if (mocking && process.env.NODE_ENV === "development") {
  const { worker } = await import("./mocks/browser");
  worker.start({
    onUnhandledRequest: ({ method, url }) => {
      if (url.pathname.startsWith("/api")) {
        throw new Error(`Unhandled ${method} request to ${url}`);
      }
    }
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
