import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import PasswordGate from "./Pages/Auth/passwordGate";
import { NotificationsProvider } from "./Context/NotificationsContext.jsx";

const client = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <AuthProvider>
        <NotificationsProvider>
          {/* <PasswordGate> */}
          <App />
          {/* </PasswordGate> */}
        </NotificationsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
