import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        try {
          const decoded = jwtDecode(token);

          if (Date.now() >= decoded.exp * 1000) {
            localStorage.removeItem("accessToken");
            return;
          }

          const response = await axios.get(
            `http://localhost:3000/users/${decoded.userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUser(response.data);
        } catch (error) {
          console.error(error);
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      }
    };
    checkAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("accessToken", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
