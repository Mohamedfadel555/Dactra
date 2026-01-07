import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const login = (token, role) => {
    setAccessToken(token);
    setRole(role);
  };

  const logout = () => {
    setAccessToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, role, login, logout, isAuthReady, setIsAuthReady }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
