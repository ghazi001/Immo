import { useState, useContext } from "react";
import { AuthContext } from "context/authContext";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
    const { login } = useContext(AuthContext);
    const [err, setErr] = useState(null);

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(inputs);
        } catch (err) {
            setErr(err.response.data);
        }
    };

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    return (
        <BasicLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    mx={2}
                    mt={-3}
                    p={2}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        Se connecter
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={2}>
                            <MDInput type="email" label="Email" name="email" fullWidth onChange={handleChange} />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="password" label="Mot de passe" name="password" fullWidth onChange={handleChange} />
                        </MDBox>
                        {err && <MDTypography variant="h6" fontWeight="regular" color="error">{err}</MDTypography>}
                        <MDBox mt={3} mb={1}>
                            <MDButton variant="gradient" color="info" fullWidth onClick={handleLogin}>
                                Se connecter
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                Vous n&apos;avez pas de compte? {" "}
                                <MDTypography
                                    component={Link}
                                    to="/authentication/sign-up"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    S&apos;inscrire
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={1} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                <MDTypography
                                    component={Link}
                                    to="/sendEmail"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    Mot de passe oubli&eacute;?
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default Basic;
