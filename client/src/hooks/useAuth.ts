import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storeToken, getToken, removeToken } from "../utils/helpers/storage";
import { useApi } from "./useApi";


type User = {
  username?: string;
  email: string;
  password: string;
};

type LoginAndRegisterResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: string; // This is the token
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(getToken());

  const { post } = useApi(); // ✅ using the useApi hook here
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await post<LoginAndRegisterResponse>(
        "http://localhost:5000/auth/login",
        { email, password }
      );

      const token = result.data;
      if (result.success && token) {
        setToken(token);
        storeToken(token);
        setUser({ email, password }); // Ideally this comes from backend
        navigate("/");
        return true;
      } else {
        alert("Login failed: " + result.message);
        return false;
      }
    } catch (error) {
      console.log("Login error:", error);
      alert("Something went wrong. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {

    try {
      setLoading(true);
      const result = await post<LoginAndRegisterResponse>(
        "http://localhost:5000/auth/register",
        { username, email, password }
      );

      const data = result.data

      if (result.success && data) {
        setUser(user);
        setLoading(false);
        alert("Successfully Registered")
        navigate("/login");
        return true
      } else {
        alert("Register failed: " + result.message);
        return false;
      }

    } catch (error) {
      console.log("Register error:", error);
      alert("Something went wrong. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }

  };

  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };
};
