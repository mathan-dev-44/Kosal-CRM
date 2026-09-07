import { createContext, useContext, useEffect, useState } from "react";

import { loginApi, getCurrentUserApi } from "../api/auth.api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await loginApi({
      email,
      password,
    });

    const { user, token } = response.data;

    localStorage.setItem("crm_token", token);

    localStorage.setItem("crm_user", JSON.stringify(user));

    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");

    setUser(null);
  };

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("crm_token");

      const storedUser = localStorage.getItem("crm_user");

      if (!token) {
        setLoading(false);
        return;
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("crm_user");
        }
      }

      try {
        const response = await getCurrentUserApi();

        setUser(response.data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  console.log(user, "cuser");
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
