import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AppRouter } from "./app/router";
import { AuthProvider } from "./app/auth/AuthProvider";
import { ThemeProvider } from "./app/theme/ThemeProvider";
import { ToastProvider } from "./components/ui/toast";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
