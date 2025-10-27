import { LoginProvider } from "./loginContext";
import { ThemeProvider } from "./ThemeContext";

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <LoginProvider>{children}</LoginProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
