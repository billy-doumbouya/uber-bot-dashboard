import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au montage : vérifier si une session existe via cookie persistant
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setAdmin(res.data.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    try {
      const res = await api.post("/auth/login", { email, password });
      setAdmin(res.data.admin);
      return res.data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout").catch(() => {});
      setAdmin(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
