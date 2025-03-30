import { useState, useContext } from "react";
import Card from "@mui/material/Card";
import { AuthContext } from "context/authContext";
import { useSearchParams } from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import axios from "axios";
import CoverLayout from "layouts/authentication/components/CoverLayout";

import bgImage from "assets/images/bg-reset-cover.jpeg";

function Reset() {
    const { currentUser, url } = useContext(AuthContext);
    const [err, setErr] = useState(null);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [success, setSuccess] = useState(null);
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const handleChangePassword = (e) => {
        setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleSend = async (e) => {
        setErr(null);
        setSuccess(null);
        try {
            if (passwords.confirmPassword != passwords.newPassword) {
                setErr("* Les mots de passe ne correspondent pas");
                return;
            }
            if (passwords.newPassword.length < 6) {
                setErr("* Le mot de passe doit \u00eatre au moins 6 caract\u00e8res");
                return;
            }
            const inputs = {
                token: token,
                password: passwords.newPassword
            }
            await axios.post(`${url}/api/resetPassword`, inputs);
            setSuccess("Votre mot de passe a \u00e9t\u00e9 chang\u00e9 avec succ\u00e9es!");
        } catch (err) {
            setErr(err.response.data);
        }
    };

    return (
        <CoverLayout coverHeight="50vh" image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="success"
                    mx={2}
                    mt={-3}
                    py={2}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
                        R&eacute;initialiser le mot de passe
                    </MDTypography>
                    <MDTypography display="block" variant="button" color="white" my={1}>
                        Vous recevrez un e-mail dans 60 secondes maximum
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={4}>
                            <MDInput
                                name="newPassword"
                                type="password"
                                label="Nouveau mot de passe"
                                variant="standard"
                                onChange={handleChangePassword}
                                fullWidth
                            />
                            <MDInput
                                name="confirmPassword"
                                type="password"
                                label="Confirmer mot de passe"
                                variant="standard"
                                onChange={handleChangePassword}
                                fullWidth
                            />
                        </MDBox>
                        {err && <MDTypography variant="h6" fontWeight="regular" color="error">{err}</MDTypography>}
                        {success && <MDTypography variant="h6" fontWeight="regular" color="success">{success}</MDTypography>}
                        <MDBox mt={6} mb={1}>
                            <MDButton variant="gradient" color="info" fullWidth onClick={handleSend}>
                                Envoyer
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </CoverLayout>
    );
}

export default Reset;
