import React from "react";
import ReactDOM from "react-dom/client";
import "./core/theme/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { customRetry, ThemeProvider, LoginProvider, App } from "./app";
import IntlProviderWrapper from "./core/localization/IntlProviderWrapper";
import { ApiError } from "./shared";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

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
