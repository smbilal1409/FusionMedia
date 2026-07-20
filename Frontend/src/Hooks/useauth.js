// src/Hooks/useauth.js
// You already have this file — replace it with this cleaner version
// that reads from AuthContext instead of calling the API directly.
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}

