
import React, { createContext, useState, useEffect } from "react";
import { authAPI } from "../services/auth.api.js"; // ensure path is correct

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) { setLoadingUser(false); return; }
      try {
        const res = await authAPI.getCurrentUser();
        setUser(res.data?.data || res.data);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await authAPI.loginUser(credentials);
      const accessToken = res.data?.data?.accessToken || res.data?.accessToken || res.data?.token;
      const refreshToken = res.data?.data?.refreshToken || res.data?.refreshToken;
      
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        // Get current user info after successful login
        const current = await authAPI.getCurrentUser();
        setUser(current.data?.data || current.data);
      }
      
      return res; // Return the response to the component
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      throw error; // Re-throw the error so the component can catch it
    }
  };

  const register = (formData) => authAPI.registerUser(formData);

  const logout = async () => {
    try { await authAPI.logoutUser(); } catch (e) { /* ignore */ }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loadingUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
