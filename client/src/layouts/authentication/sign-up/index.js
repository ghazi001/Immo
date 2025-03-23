import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import axios from "axios";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import { useContext, useState } from "react";
import MDSnackbar from "../../../components/MDSnackbar";
import { AuthContext } from "../../../context/authContext";

const Register = () => {
    const { signUp } = useContext(AuthContext);
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        lastName: "",
        firstName: "",
        email: "",
        password: "",
    });
    const [err, setErr] = useState(null);
    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const closeSuccessSB = () => {
        setSuccessSB(false);
        window.location.replace(window.location.origin + "/authentication/sign-in");
    };
    const closeErrorSB = () => setErrorSB(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await signUp(inputs);
        } catch (err) {
            setErr(err.response == undefined ? "Probléme de connexion au BD" : err.response.data);
            setErrorSB(true);
        }
    };

    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Création du compte"
            content="L'utilisateur a été créé."
            dateTime="11 mins ago"
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );
    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            title="Impossible de créer un compte"
            content={err}
            dateTime="à l'instant"
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );
    return (
        <DashboardLayout>
            <CoverLayout image={bgImage}>
                <Card>
                    <MDBox
                        variant="gradient"
                        bgColor="info"
                        borderRadius="lg"
                        coloredShadow="success"
                        mx={2}
                        mt={-3}
                        p={3}
                        mb={1}
                        textAlign="center"
                    >
                        <MDTypography variant="h4" fontWeight="medium" color="white" mt={0}>
                            Enregistrez-vous
                        </MDTypography>
                        <MDTypography display="block" variant="button" color="white" my={0}>
                            Entrez vos donn&eacute;es pour vous inscrire
                        </MDTypography>
                    </MDBox>
                    <MDBox pt={2} pb={3} px={3}>
                        <MDBox component="form" role="form">
                            <MDBox mb={2}>
                                <MDInput
                                    name="lastName"
                                    type="text"
                                    label="Nom"
                                    variant="standard"
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="firstName"
                                    type="text"
                                    label="Pr&eacute;nom"
                                    variant="standard"
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="email"
                                    type="email"
                                    label="Email"
                                    variant="standard"
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput
                                    name="password"
                                    type="password"
                                    label="Mot de passe"
                                    variant="standard"
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox mt={4} mb={1}>
                                <MDButton variant="gradient" color="info" onClick={handleSignUp} fullWidth>
                                    Cr&eacute;er votre compte
                                </MDButton>
                            </MDBox>
                            <MDBox mt={3} mb={1} textAlign="center">
                                <MDTypography variant="button" color="text">
                                    Vous avez d&eacute;j&agrave; un compte ? {" "}
                                    <MDTypography
                                        component={Link}
                                        to="/authentication/sign-in"
                                        variant="button"
                                        color="info"
                                        fontWeight="medium"
                                        textGradient
                                    >
                                        Se connecter
                                    </MDTypography>
                                </MDTypography>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </Card>
                {renderSuccessSB}
                {renderErrorSB}
            </CoverLayout>
        </DashboardLayout>
    );
};

export default Register;
