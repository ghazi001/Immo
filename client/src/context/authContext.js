import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Initialize } from "../layouts/projects/newProject/common.tsx";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [newProject, setNewProject] = useState(null);
    const navigate = useNavigate();
    const url = "http://188.165.231.114:8880";

    const login = async (inputs) => {
        const res = await axios.post(`${url}/api/auth/login`, inputs);

        setCurrentUser(res.data);
        if (res.status == 200 != null && newProject != null) {
            var project = newProject;
            project.userId = res.data.id;
            setNewProject(null);
            try {
                let result = await axios.post(`${url}/api/projects/addProject`, newProject);
                if (result.status == 200) {
                    let id = result.data;
                    try {
                        await axios.post(`${url}/api/mails/sendMails?projectId=${id}`);
                    } catch (err) {
                    }
                    Initialize();
                    navigate(`/mes-projets/estimation/${id}`);
                }
            } catch (err) {
                setErrMessage(err.response == undefined ? "Probl\u00e9me de connexion au BD" : err.response.data);
            }
        }
        else {
            navigate("/");
        }
    };


    const signUp = async (inputs) => {
        const res = await axios.post(`${url}/api/auth/register`, inputs);
        if (res.status == 200 != null && res.data.idUser != (null || undefined))
        {
            var user = { ...inputs, id: res.data.idUser };

            setCurrentUser(user);
            if (res.status == 200 != null && newProject != null)
            {
                var project = newProject;
                project.userId = user.id;
                setNewProject(null);
                try {
                    let result = await axios.post(`${url}/api/projects/addProject`, newProject);
                    if (result.status == 200) {
                        let id = result.data;
                        try {
                            await axios.post(`${url}/api/mails/sendMails?projectId=${id}`);
                        } catch (err) {
                        }
                        Initialize();
                        navigate(`/mes-projets/estimation/${id}`);
                    }
                } catch (err) {
                    setErrMessage(err.response == undefined ? "Probl\u00e9me de connexion au BD" : err.response.data);
                }
            }
            else {
                navigate("/");
            }
        }
    };

    const updateInfo = async (inputs) => {
        var info = currentUser;
        info.userName = inputs.userName;
        info.lastName = inputs.lastName;
        info.email = inputs.email;
        setCurrentUser(info);
        localStorage.setItem("user", JSON.stringify(info));
    };

    const logout = async () => {
        await axios.post(`${url}/api/auth/logout`);

        setCurrentUser(null);
        navigate("/");
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return <AuthContext.Provider value={{ currentUser, updateInfo, login, logout, signUp, url, newProject, setNewProject }}>{children} </AuthContext.Provider>;
};
