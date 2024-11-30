import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [waitnigToSignIn, setWaitingToSignIn] = useState(false);
  const [isLogIn, setIsLogIn] = useState(false);

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data);
  };

  const logout = async () => {
    await axios.post("http://localhost:8800/api/auth/logout", {
      withCredentials: true,
    });

    setCurrentUser(null);
  };
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser, waitnigToSignIn, isLogIn  ]);

  return <AuthContext.Provider value={{ currentUser, login, logout, waitnigToSignIn, setWaitingToSignIn, isLogIn, setIsLogIn}}>{children} </AuthContext.Provider>;
};
