import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";
import NewProject from "layouts/projects/Estimation du bien";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    state: "Showed",
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
    name: "Estimation du projet",
    key: "newProject",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/newProject",
    component: <NewProject />,
    state: "Showed",
  },
  {
    type: "collapse",
    name: "Se connecter",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    state: "Disconnected",
  },
  {
    type: "collapse",
    name: "S'inscrire",
    key: "sign-up",
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
    route: "/Dashboard",
    component: <Dashboard />,
    state: "Connected",
  },
];

export default routes;
