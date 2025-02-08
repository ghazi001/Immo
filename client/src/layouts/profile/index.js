
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Overview page components
import Header from "layouts/profile/components/Header";
import { AuthContext } from "context/authContext";
import { useContext, useState } from "react";
import MDButton from "../../components/MDButton";
import MDInput from "../../components/MDInput";
import MDTypography from "../../components/MDTypography";
import { Card, Icon, Tooltip, Typography } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import axios from "axios";

function Overview() {
    const [selected, setSelected] = useState(1);
    const { currentUser, url, updateInfo } = useContext(AuthContext);
    const [err, setErr] = useState(null);
    const [editInfo, setEditProfile] = useState(false);
    const [success, setSuccess] = useState(null);
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const [inputs, setInputs] = useState({
        username: currentUser.username,
        email: currentUser.email,
        name: currentUser.name,
    });

    const [passwords, setPasswords] = useState({
        username: currentUser.username,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const closeErrorSB = () => setErrorSB(false);
    const closeSuccessSB = () => setSuccessSB(false);

    const handleChangeInfo = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleChangePassword = (e) => {
        setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        try {
            if (passwords.confirmPassword != passwords.newPassword) {
                setErrorMessage("* Les mots de passe ne correspondent pas");
                return;
            }
            if (passwords.newPassword.length < 6 ) {
                setErrorMessage("* Le mot de passe doit être d'au moins 6 caractères");
                return;
            }
            await axios.put(`${url}/api/users/updatePassword`, passwords);
            setSuccess("Votre mot de passe a été changé avec succées!");
            setSuccessSB(true);
        } catch (err) {
            setErr(err.response == undefined ? "Probléme de connexion au BD" : err.response.data);
            setErrorSB(true);
        }
    };
    const handleUpdateProlife = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${url}/api/users/updateAccount`, inputs);
            setSuccess("vos informations ont été modifiées changé avec succées!");
            setSuccessSB(true);
            setEditProfile(false);
            updateInfo(inputs);
        } catch (err) {
            setErr(err.response == undefined ? "Probléme de connexion au BD" : err.response.data);
            setErrorSB(true);
        }
    };
    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Succès"
            content={success}
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
            title="Erreur"
            content={err}
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mb={2} />
            <Header setSelected={setSelected}>
                <MDBox mt={8}>
                    <MDBox mb={3}>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={12} lg={8} >
                                <Grid container spacing={3}>
                                    {selected == 1 ? (

                                        <Grid item xs={12} md={6} xl={8} sx={{ display: "wrap" }}>
                                            {!editInfo ?
                                                (
                                                    <Card sx={{ height: "100%", boxShadow: "none" }}>
                                                        <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
                                                            <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                                                                Informations de profil
                                                            </MDTypography>
                                                            <MDTypography variant="body2" color="secondary">
                                                                <Tooltip placement="top">
                                                                    <Icon onClick={(e) => setEditProfile(true)}>edit</Icon>
                                                                </Tooltip>
                                                            </MDTypography>
                                                        </MDBox>
                                                        <MDBox p={2}>
                                                            <MDBox>
                                                                <MDBox display="flex" py={1} pr={2}>
                                                                    <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                                        nom d&apos; utilisateur: &nbsp;
                                                                    </MDTypography>
                                                                    <MDTypography variant="button" fontWeight="regular" color="text">
                                                                        &nbsp;{currentUser.username}
                                                                    </MDTypography>
                                                                </MDBox>
                                                                <MDBox display="flex" py={1} pr={2}>
                                                                    <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                                        nom et prénom: &nbsp;
                                                                    </MDTypography>
                                                                    <MDTypography variant="button" fontWeight="regular" color="text">
                                                                        &nbsp;{currentUser.name}
                                                                    </MDTypography>
                                                                </MDBox>
                                                                <MDBox display="flex" py={1} pr={2}>
                                                                    <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                                        email: &nbsp;
                                                                    </MDTypography>
                                                                    <MDTypography variant="button" fontWeight="regular" color="text">
                                                                        &nbsp;{currentUser.email}
                                                                    </MDTypography>
                                                                </MDBox>
                                                            </MDBox>
                                                        </MDBox>
                                                    </Card>
                                                ) : (
                                                    <>
                                                        <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
                                                            <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                                                                Modifier les informations de profil
                                                            </MDTypography>
                                                            <MDTypography variant="body2" color="secondary">
                                                                <Tooltip placement="top">
                                                                    <Icon onClick={(e) => setEditProfile(false)}>close</Icon>
                                                                </Tooltip>
                                                            </MDTypography>
                                                        </MDBox>
                                                        <MDBox mt={2} pt={2} pb={3} px={3} >
                                                            <MDBox component="form" role="form">
                                                                <MDBox mb={2}>
                                                                    <MDInput
                                                                        name="name"
                                                                        type="text"
                                                                        label="Nom et pr&eacute;nom"
                                                                        value={inputs.name}
                                                                        variant="standard"
                                                                        onChange={handleChangeInfo}
                                                                        fullWidth
                                                                    />
                                                                    <Divider/>
                                                                    <MDInput
                                                                        name="email"
                                                                        type="email"
                                                                        label="Mail"
                                                                        defaultValue={inputs.email}
                                                                        variant="standard"
                                                                        onChange={handleChangeInfo}
                                                                        fullWidth
                                                                    />
                                                                </MDBox>
                                                                <MDBox mt={4} mb={1}>
                                                                    <MDButton variant="gradient" color="info" onClick={handleUpdateProlife} fullWidth>
                                                                        Modifier
                                                                    </MDButton>
                                                                </MDBox>
                                                            </MDBox>
                                                        </MDBox>
                                                    </>
                                                )
                                            }

                                            <Divider orientation="vertical" sx={{ mx: 0 }} />
                                        </Grid>
                                    ) : (
                                        <>
                                            <Grid item xs={12} md={6} xl={8} sx={{ display: "wrap" }}>
                                                <Typography variant="h6" component="h2" color="white" my={0}>
                                                    Changer votre mot de passe
                                                </Typography>
                                                <MDBox mt={2} pt={2} pb={3} px={3} >
                                                    <MDBox component="form" role="form">
                                                        <MDBox mb={2}>
                                                            <MDInput
                                                                name="oldPassword"
                                                                type="password"
                                                                label="Ancien mot de passe"
                                                                variant="standard"
                                                                onChange={handleChangePassword}
                                                                fullWidth
                                                            />
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
                                                            {errorMessage != null &&
                                                                <MDTypography variant="body2" color="error">
                                                                    {errorMessage }
                                                                </MDTypography>
                                                            }
                                                        <MDBox mt={4} mb={1}>
                                                            <MDButton variant="gradient" color="info" onClick={handleUpdatePassword} fullWidth>
                                                                Modifier
                                                            </MDButton>
                                                        </MDBox>
                                                    </MDBox>
                                                </MDBox>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </MDBox>
                </MDBox>
            </Header>
            {renderSuccessSB}
            {renderErrorSB}
            <Footer />
        </DashboardLayout>
    );
}

export default Overview;
