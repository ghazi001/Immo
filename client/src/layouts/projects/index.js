import { Fragment, useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// Images
import duplexImg from "assets/images/duplex.png";
import houseImg from "assets/images/house.png";
import triplexImg from "assets/images/triplex.png";

import { Card, CardMedia, Icon, Modal } from "@mui/material";
import { AuthContext } from "context/authContext";
import { useNavigate } from "react-router-dom";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import dayjs from "dayjs";
import MDSnackbar from "../../components/MDSnackbar";
import axios from "axios";
import backgroundImage from "assets/images/bg-profile.jpeg";


function Projects() {
    const { currentUser, url } = useContext(AuthContext);
    const [projects, setProjects] = useState(null);
    const navigate = useNavigate();
    const [warningSB, setWarningSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);
    const closeSuccessSB = () => setSuccessSB(false);
    const closeErrorSB = () => setErrorSB(false);
    const closeWarningSB = () => setWarningSB(false);

    const InitializeProject = (project) => {
        var ville = { id: project.villeId, ville: project.ville }
        var commune = { id: project.communeId, commune: project.commune }
        var zone = { id: project.zoneId, zone: project.zone }
        var quartier = { id: project.quartierId, quartier: project.quartier }
        var date = dayjs(project.dateTitre).format("YYYY-MM-DD");
        localStorage.setItem("ville", JSON.stringify(ville));
        localStorage.setItem("commune", JSON.stringify(commune));
        localStorage.setItem("quarter", JSON.stringify(quartier));
        localStorage.setItem("zone", JSON.stringify(zone));
        localStorage.setItem("titre", JSON.stringify(project.titre));
        localStorage.setItem("date", JSON.stringify(date));
        localStorage.setItem("houseType", JSON.stringify(project.typeMaison));
        localStorage.setItem("standingType", JSON.stringify(project.typeStanding));
        localStorage.setItem("garage", JSON.stringify(project.garage));
        localStorage.setItem("nbrRooms", JSON.stringify(project.nbrPiece));
        localStorage.setItem("surface", JSON.stringify(project.surface));
        localStorage.setItem("topologie", JSON.stringify(project.topologie));
        localStorage.setItem("funding", JSON.stringify(project.financement));
        localStorage.setItem("otherQuarter", quartier.id != 0 ? JSON.stringify(null) : JSON.stringify(project.quartierAutreLabel));
        localStorage.setItem("otherZone", zone.id != 0 ? JSON.stringify(null) : JSON.stringify(project.zoneAutreLabel));
        navigate("/nouveau-Projet");
    }

    const handleRemoveProject = async (project) => {
        try {
            await axios.delete(`${url}/api/projects/deleteProject?projectId=${project.id}`);
            var list = projects;
            list = list.filter(x => x.id != project.id);
            setProjects(list);
            setSuccessSB(true);
        } catch (err) {
            setErrorSB(true);
        }
    };

    useEffect(() => {
        if (!currentUser)
            navigate("/nouveau-projet")
        else {
            fetch(`${url}/api/projects/list?userId=${currentUser.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setProjects(data);
                });
        }
    }, []);

    const renderWarningSB = (
        <MDSnackbar
            color="warning"
            icon="warning"
            title="Impossible d'ajouter la p&eacute;rsonnalisation"
            content="V&eacute;rifier les donn&eacute;es qui ont &eacute;t&eacute; saisis!!!"
            open={warningSB}
            onClose={closeWarningSB}
            close={closeWarningSB}
        />
    );
    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Suppression r&eacute;ussie"
            content="Le projet a &eacute;t&eacute; supprim&eacute; avec succ&eacute;s."
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
            title="Erreur de suppression"
            content="Une erreur est survenue lors de la tentative de suppression du projet."
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox
                display="flex"
                alignItems="center"
                position="relative"
                minHeight="10.75rem"
                borderRadius="xl"
                sx={{
                    backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
                        `${linearGradient(
                            rgba(gradients.info.main, 0.6),
                            rgba(gradients.info.state, 0.6)
                        )}, url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "50%",
                    overflow: "hidden",
                }}
            />
            <MDBox mb={3}>
                <Card sx={{
                    position: "relative",
                    mt: -8,
                    mx: 3,
                    py: 2,
                    px: 2,
                }}>
                    <MDBox py={2}>
                        <Grid container spacing={6} p={3}>
                            {projects &&
                                projects.map((project) => (
                                    <Grid item xs={12} md={6} xl={3} key={project.id}>
                                        <Card
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                backgroundColor: "transparent",
                                                boxShadow: "none",
                                                overflow: "visible",
                                            }}
                                        >
                                            <MDButton
                                                variant="gradient"
                                                size="medium"
                                                color="error"
                                                sx={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}
                                                onClick={() => { handleRemoveProject(project) }}
                                                iconOnly
                                            >
                                                <Icon>delete</Icon>
                                            </MDButton>
                                            <MDBox position="relative" width="100%" shadow="xl" borderRadius="xl">
                                                <CardMedia
                                                    src={project.typeMaison == "TRX" ? triplexImg : project.typeMaison == "DUX" ? duplexImg : houseImg}
                                                    component="img"
                                                    title={parseFloat(project.surfaceUtile) + "m\u00b2, " + project.estimation}
                                                    sx={{
                                                        maxWidth: "100%",
                                                        margin: 0,
                                                        boxShadow: ({ boxShadows: { md } }) => md,
                                                        objectFit: "cover",
                                                        objectPosition: "center",
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mt={1} mx={0.5}>
                                                <MDTypography variant="button" fontWeight="regular" color="text" textTransform="capitalize">
                                                    {project.typeMaisonLabel}, {project.typeStandingLabel}
                                                </MDTypography>
                                                <MDBox mb={1}>
                                                    <MDTypography
                                                        component="h2"
                                                        variant="h5"
                                                        textTransform="capitalize"
                                                    >
                                                        {parseFloat(project.surfaceUtile) + "m\u00b2, " + project.estimation}
                                                    </MDTypography>
                                                </MDBox>
                                                <MDBox mb={3} lineHeight={0}>
                                                    <MDTypography variant="button" fontWeight="light" color="text">
                                                        {project.ville + ", " + project.commune}<br />
                                                        {project.quartierLabel + ", " + project.zoneLabel}
                                                    </MDTypography>
                                                </MDBox>
                                                <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                                    <MDButton
                                                        variant="outlined"
                                                        size="small"
                                                        color="info"
                                                        sx={{ marginBottom: 1 }}
                                                        component={Link}
                                                        to={`/mes-projets/estimation/${project.id}`}
                                                    >
                                                        VOIR ESTIMATION
                                                    </MDButton>
                                                    <MDButton
                                                        variant="outlined"
                                                        size="small"
                                                        color="success"
                                                        onClick={() => { InitializeProject(project) }}
                                                    >
                                                        MODIFIER LE PROJET
                                                    </MDButton>
                                                </MDBox>
                                            </MDBox>
                                        </Card>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </MDBox>
                </Card>
                {renderWarningSB}
                {renderSuccessSB}
                {renderErrorSB}
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Projects;
