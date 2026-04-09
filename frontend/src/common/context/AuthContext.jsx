import { createContext, useContext, useState, useEffect } from "react";
import api from "../../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("wellfitness_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("wellfitness_user");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const data = res.data.data;
    localStorage.setItem("wellfitness_token", data.token);
    localStorage.setItem("wellfitness_user", JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const data = res.data.data;
    // Backend doesn't return a token if OTP is required
    if (!data.otpRequired && data.token) {
      localStorage.setItem("wellfitness_token", data.token);
      localStorage.setItem("wellfitness_user", JSON.stringify(data));
      setToken(data.token);
      setUser(data);
    }
    return data;
  };

  const verifyEmailOtp = async (email, otp) => {
    const res = await api.post("/auth/otp/email/verify", { email, otp });
    const data = res.data.data;
    localStorage.setItem("wellfitness_token", data.token);
    localStorage.setItem("wellfitness_user", JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("wellfitness_token");
    localStorage.removeItem("wellfitness_user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("wellfitness_user", JSON.stringify(updated));
  };

  // Direct token login (for OTP / Google auth)
  const loginWithToken = (authData) => {
    localStorage.setItem("wellfitness_token", authData.token);
    localStorage.setItem("wellfitness_user", JSON.stringify(authData));
    setToken(authData.token);
    setUser(authData);
    return authData;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        loginWithToken,
        verifyEmailOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
