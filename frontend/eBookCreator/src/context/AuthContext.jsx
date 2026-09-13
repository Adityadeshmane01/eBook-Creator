import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./authContextValue";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getStoredUser = () => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    return token && user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getStoredUser()));

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  }, []);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      checkAuthStatus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [checkAuthStatus]);

  const login = useCallback((userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser((currentUser) => {
      const newUserData = { ...currentUser, ...updatedUserData };
      localStorage.setItem("user", JSON.stringify(newUserData));
      return newUserData;
    });
  }, []);

const value = {
  user,
  loading,
  isAuthenticated,
  login,
  logout,
  updateUser,
  checkAuthStatus,
};

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
