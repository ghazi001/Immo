import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [waitnigToSignIn, setWaitingToSignIn] = useState(false);
  const [isLogIn, setIsLogIn] = useState(false);
  const navigate = useNavigate();
  const url = "http://188.165.231.114:8800";

  const login = async (inputs) => {
    const res = await axios.post(`${url}/api/auth/login`, inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data);
  };

  const logout = async () => {
      await axios.post(`${url}/api/auth/logout`, {
      withCredentials: true,
    });

      setCurrentUser(null);
      navigate("/");
  };
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser, waitnigToSignIn, isLogIn  ]);

  return <AuthContext.Provider value={{ currentUser, login, logout, waitnigToSignIn, setWaitingToSignIn, isLogIn, setIsLogIn, url}}>{children} </AuthContext.Provider>;
};
