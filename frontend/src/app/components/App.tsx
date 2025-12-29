import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import { Analytics } from "@vercel/analytics/react";
import { AppRoutes } from "@/app/constants";
import { LoginPage, SignupPage, TermsPage } from "@/features/auth";
import { WelcomePage, HomePage } from "@/features/dashboard/components";
import { PrivacyPolicyPage } from "@/features/auth/components/PrivacyPolicyPage";
import { LoginProvider, ThemeProvider, useLogin } from "../providers";
import IntlProviderWrapper from "@/core/localization/IntlProviderWrapper";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "@/shared";
import { customRetry } from "../utils";
import ErrorBoundary from "./ErrorBoundary";

function AppContent() {
  const { loggedInUser } = useLogin();

  return (
    <div className="main-app">
      <BrowserRouter>
        <Routes>
          <Route path={AppRoutes.WELCOME_PAGE} element={<WelcomePage />} />
          <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
          <Route path={AppRoutes.SIGNUP} element={<SignupPage />} />
          <Route path={AppRoutes.TERMS} element={<TermsPage />} />
          <Route
            path={AppRoutes.PRIVACY_POLICY}
            element={<PrivacyPolicyPage />}
          />

          <Route
            path="/*"
            element={
              loggedInUser ? (
                <HomePage loggedInUser={loggedInUser} />
              ) : (
                <Navigate to={AppRoutes.WELCOME_PAGE} replace={true} />
              )
            }
          />
        </Routes>
      </BrowserRouter>

      <Analytics />
    </div>
  );
}

const App = () => {
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

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemeProvider>
          <LoginProvider>
            <React.StrictMode>
              <IntlProviderWrapper>
                <AppContent />
              </IntlProviderWrapper>
              {/* <ReactQueryDevtools /> */}
            </React.StrictMode>
          </LoginProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
