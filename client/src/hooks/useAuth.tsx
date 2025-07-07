// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { storeToken, getToken, removeToken } from "../utils/helpers/storage";
// import { useApi } from "./useApi";


// type User = {
//   username?: string;
//   email: string;
//   password: string;
// };

// type LoginAndRegisterResponse = {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data: string; // This is the token
// };

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState<string | null>(getToken());

//   const { post } = useApi(); // ✅ using the useApi hook here
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (token) {
//       setLoading(false);
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   const handleToken = (token: string) => {
//     setToken(token)
//   }

//   const login = async (email: string, password: string): Promise<boolean> => {
//     try {
//       setLoading(true);
//       const result = await post<LoginAndRegisterResponse>(
//         "http://localhost:5000/auth/login",
//         { email, password }
//       );

//       const token = result.data;
//       if (result.success && token) {
//         setToken(token);
//         storeToken(token);
//         setUser({ email, password }); // Ideally this comes from backend
//         navigate("/");
//         return true;
//       } else {
//         alert("Login failed: " + result.message);
//         return false;
//       }
//     } catch (error) {
//       console.log("Login error:", error);
//       alert("Something went wrong. Please try again.");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (
//     username: string,
//     email: string,
//     password: string
//   ) => {

//     try {
//       setLoading(true);
//       const result = await post<LoginAndRegisterResponse>(
//         "http://localhost:5000/auth/register",
//         { username, email, password }
//       );

//       const data = result.data

//       if (result.success && data) {
//         setUser(user);
//         setLoading(false);
//         alert("Successfully Registered")
//         navigate("/login");
//         return true
//       } else {
//         alert("Register failed: " + result.message);
//         return false;
//       }

//     } catch (error) {
//       console.log("Register error:", error);
//       alert("Something went wrong. Please try again.");
//       return false;
//     } finally {
//       setLoading(false);
//     }

//   };

//   //this authenticated state should be fixed.

//   const logout = () => {
//     removeToken();
//     setToken(null);
//     setUser(null);
//     // navigate("/login");
//   };

//   console.log("token in useAuth", token)
//   return {
//     user,
//     token,
//     loading,
//     login,
//     register,
//     logout,
//     handleToken,
//     isAuthenticated: !!token,
//   };
// };


import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { storeToken, getToken, removeToken } from "../utils/helpers/storage";
import { useApi } from "./useApi";
import { jwtDecode } from "jwt-decode";

// Types
type User = {
  username?: string;
  id: string;
};

type LoginAndRegisterResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: string; // token
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  handleToken: (token: string) => void;
  loading: boolean;
  isAuthenticated: boolean;
};



// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getToken());
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { post } = useApi();


  const getConditionalNavigation = () => {
    const pending = localStorage.getItem("bookingRedirectDetails");

    if (pending) {
      const parsedData = JSON.parse(pending);
      localStorage.removeItem("bookingRedirectDetails"); // Clean up

      // Redirect back to booking page, pass data via state
      navigate(parsedData.redirectTo, { state: parsedData.bookingData });
    } else {
      // Go to home or profile
      navigate("/");
    }
  }

  const handleToken = (token: string) => {
    setToken(token)
  }
  // 🔄 Sync token & decode user info
  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        setUser({ id: decoded.id, username: decoded.username });
        setToken(storedToken);
      } catch (err) {
        console.error("Invalid token");
        removeToken();
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await post<LoginAndRegisterResponse>(
        "http://localhost:5000/auth/login",
        { email, password }
      );

      const token = result.data;

      if (result.success && token) {
        storeToken(token);
        setToken(token);
        const decoded: any = jwtDecode(token);
        setUser({ id: decoded.id, username: decoded.username });
        getConditionalNavigation()
        // navigate("/");
        return true;
      } else {
        alert("Login failed: " + result.message);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
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
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await post<LoginAndRegisterResponse>(
        "http://localhost:5000/auth/register",
        { username, email, password }
      );

      if (result.success && result.data) {
        alert("Successfully Registered!");
        navigate("/login");
        return true;
      } else {
        alert("Register failed: " + result.message);
        return false;
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Something went wrong. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setToken(null);
    // navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        register,
        handleToken,
        loading,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  )
};

// Custom hook to use context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

