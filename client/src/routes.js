import NewProject from "./layouts/projects/newProject";
import Projects from "./layouts/projects";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Profile from "layouts/profile";
import Estimate from "layouts/projects/estimate";
import CoverPassword from "layouts/authentication/reset-password/cover";
import ResetPassword from "layouts/authentication/reset-password";

// @mui icons
import Icon from "@mui/material/Icon";
import AddHoweWorkIcon from '@mui/icons-material/AddHomeWork';

const routes = [
    {
        type: "collapse",
        name: "Mes projets",
        key: "mes-projets",
        icon: <Icon fontSize="small">source</Icon>,
        route: "/mes-projets",
        component: <Projects />,
        state: "Connected",
    },
    {
        type: "collapse",
        name: "Profile",
        key: "profile",
        icon: <Icon fontSize="small">person</Icon>,
        route: "/profile",
        component: <Profile />,
        state: "Connected",
    },
    {
        type: "collapse",
        name: "Nouveau projet",
        key: "nouveau-Projet",
        icon: <AddHoweWorkIcon fontSize="small" />,
        route: "/nouveau-Projet",
        component: <NewProject />,
        state: "Showed",
    },
    {
        type: "collapse",
        name: "Se connecter",
        key: "authentication/sign-in",
        icon: <Icon fontSize="small">login</Icon>,
        route: "/authentication/sign-in",
        component: <SignIn />,
        state: "Disconnected",
    },
    {
        type: "collapse",
        name: "S'inscrire",
        key: "authentication/sign-up",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/authentication/sign-up",
        component: <SignUp />,
        state: "Disconnected",
    },
    {
        type: "collapse",
        name: "Se d\u00e9connecter",
        key: "exit",
        icon: <Icon fontSize="small">logout</Icon>,
        route: "/mes-projets",
        component: <Projects />,
        state: "Connected",
    },
    {
        type: "divider",
        name: "Estimation du projet",
        key: "Estimation du projet",
        route: `/mes-projets/estimation/:id`,
        component: <Estimate />,
        state: "Connected",
    },
    {
        type: "divider",
        name: "sendEmail",
        key: "sendEmail",
        route: `/sendEmail`,
        component: <CoverPassword />,
        state: "Disconnected",
    },
    {
        type: "divider",
        name: "resetPassword",
        key: "resetPassword",
        route: `/resetPassword`,
        component: <ResetPassword />,
        state: "Disconnected",
    },
];

export default routes;
