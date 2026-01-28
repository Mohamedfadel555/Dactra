import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import PasswordGate from "./Pages/Auth/passwordGate";

const client = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <AuthProvider>
        <PasswordGate>
          <App />
        </PasswordGate>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
