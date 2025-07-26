import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { LoginProvider } from "./context/loginContext";
import { ThemeProvider } from "./context/ThemeContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import IntlProviderWrapper from "./IntlProviderWrapper";
import { ApiError } from "./fetch/ApiError";
import { customRetry } from "./utils";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Register service worker
// if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((registration) => {
//         console.log("SW registered:", registration);
//       })
//       .catch((registrationError) => {
//         console.log("SW registration failed:", registrationError);
//       });
//   });
// }

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 5 * 60 * 1000, // 5 minutes
      // cacheTime: 15 * 60 * 1000, // 15 minutes
      retry: customRetry,
      // retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
      refetchOnWindowFocus: true,
      onError: (error: ApiError) => {
        console.warn(
          `Query failed with status ${error.status}: ${error.message}`,
        );
      },
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LoginProvider>
        <React.StrictMode>
          <IntlProviderWrapper>
            <App />
          </IntlProviderWrapper>
          {/* <ReactQueryDevtools /> */}
        </React.StrictMode>
      </LoginProvider>
    </ThemeProvider>
  </QueryClientProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
