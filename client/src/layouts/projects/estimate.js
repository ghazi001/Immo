import { useState, useEffect, useContext } from "react";
import { styled } from '@mui/material/styles';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import MDButton from "components/MDButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import { AuthContext } from "context/authContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Perso from "./personalization";
import MDSnackbar from "../../components/MDSnackbar";

const ScrolingCard = styled(Card)(() => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "80%",
    padding: 30,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    scrollbarWidth: "none", // Hide the scrollbar for firefox
    '&::-webkit-scrollbar': {
        display: 'none', // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
    },
    '&-ms-overflow-style:': {
        display: 'none', // Hide the scrollbar for IE
    },
}));


function Estimate() {
    const { currentUser, url } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingBudget, setLoadingBudget] = useState(true);
    const [loadingCorps, setLoadingCorps] = useState(true);
    const [corps, setCorps] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [piecesList, setPiecesList] = useState([]);
    const [constructionList, setConstructionList] = useState([]);
    const [standingList, setStandingList] = useState([]);
    const [garageList, setGarageList] = useState([]);
    const [warningSB, setWarningSB] = useState(false);
    const closeWarningSB = () => setWarningSB(false);

    useEffect(() => {
        if (!currentUser)
            navigate("/nouveau-projet")
        else {
            try {
                axios.get(`${url}/api/projects/getProjectByUserId?projectId=${id}&userId=${currentUser.id}`)
                    .then((res) => {
                        setProject(res.data);
                        setLoading(false);
                    });

            } catch (Exception) {
                window.location.replace(window.location.origin + "/mes-projets");
            }

            try {
                fetch(`${url}/api/projects/getEstimationByIdProject?idProject=${id}`)
                    .then((res) => res.json())
                    .then((data) => {
                        setBudget(data[0]);
                        setLoadingBudget(false);
                    });
            } catch (Exception) {
                setBudget(null);
                setLoadingBudget(false);
            }
            try {
                fetch(`${url}/api/projects/detailCorpEtatByIdProject?projectId=${id}`)
                    .then((res) => res.json())
                    .then((data) => {
                        setCorps(data);
                        setLoadingCorps(false);
                    });
            } catch (Exception) {
                setCorps(null);
                setLoadingCorps(false);
            }

            try {
                fetch(`${url}/api/data/getNombreDeGarages`)
                    .then((res) => res.json())
                    .then((data) => {
                        setGarageList(data);
                    });
                fetch(`${url}/api/data/getTypeDePieces`)
                    .then((res) => res.json())
                    .then((data) => {
                        setPiecesList(data);
                    });
                fetch(`${url}/api/data/getTypesDeConstruction`)
                    .then((res) => res.json())
                    .then((data) => {
                        setConstructionList(data);
                    });

                fetch(`${url}/api/data/getStanding`)
                    .then((res) => res.json())
                    .then((data) => {
                        setStandingList(data);
                    });
            } catch (Exception) {
                setPiecesList(null);
            }
        }
    }, [])

    const renderModalPerso = (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ScrolingCard sx={{ width: "50%" }} >
                <Perso project={project} setProject={setProject} piecesList={piecesList} setBudget={setBudget} setCorps={setCorps}
                    constructionList={constructionList} standingList={standingList} garageList={garageList} setOpen={setOpen} setWarningSB={setWarningSB}
                />
            </ScrolingCard>
        </Modal >
    );

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

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mb={3}>
                <Card>
                    <Grid container spacing={6} p={3} justifyContent="center">
                        <Grid item xs={12} lg={12}>
                            <Grid container sx={{ overflow: "auto", scrollbarWidth: "none" }} mb={1} p={1}>
                                {(loading || loadingBudget || loadingCorps) ?
                                    (
                                        <Box align="center" sx={{ my: 3 }} width="100%" height="100%">
                                            < CircularProgress disableShrink={true} />
                                            <MDTypography mb={2} color="primary" fontSize={15}>
                                                chargement des donn&eacute;es
                                            </MDTypography>
                                        </Box>
                                    ) : (
                                        <>
                                            <Grid item xs={12} md={12} xl={12} pr={3} mb={2}>
                                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                                    Estimation du projet
                                                </Typography>
                                                <MDButton variant="contained" color="primary" sx={{ float: "right", marginTop: 3, padding: 1 }} onClick={handleOpen} focus={false}>
                                                    Personnaliser
                                                </MDButton>
                                                <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: 14, ml: 3 }} component="h6">
                                                    <b>Notre proposition:</b>
                                                    <br />
                                                    {project.typeMaisonLabel} de {project.nbrPiece} Pi&eacute;ce(s) {project.typeStandingLabel} avec une surface utile de {parseFloat(project.surfaceUtile)} m&sup2;
                                                    <br />
                                                    Garage: {project.garage}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={12} xl={12}>
                                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                                    Estimation du budget de construction:
                                                </Typography>
                                                {(loadingBudget) ?
                                                    (
                                                        <Box align="center" sx={{ my: 3 }} >
                                                            < CircularProgress disableShrink={true} />
                                                            <MDTypography mb={2} color="primary" fontSize={15}>
                                                                chargement des donn&eacute;es
                                                            </MDTypography>
                                                        </Box>
                                                    ) : (
                                                        <TableContainer component={Paper} sx={{ width: "max-content", my: 2 }}>
                                                            <Table>
                                                                <TableRow>
                                                                    <TableCell align="center" sx={{ fontWeight: 500 }}>Min</TableCell>
                                                                    <TableCell align="center" sx={{ fontWeight: 500 }}>Budget estim&eacute;</TableCell>
                                                                    <TableCell align="center" sx={{ fontWeight: 500 }}>Max</TableCell>
                                                                </TableRow>
                                                                <TableRow
                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                >
                                                                    <TableCell align="center">{budget != null ? budget.Min : 0}</TableCell>
                                                                    <TableCell align="center">{budget != null ? Object.values(budget)[Object.keys(budget).findIndex(x => x.startsWith("Budget"))] : 0}</TableCell>
                                                                    <TableCell align="center">{budget != null ? budget.max : 0}</TableCell>
                                                                </TableRow>
                                                            </Table>
                                                        </TableContainer>
                                                    )}
                                            </Grid>
                                            <Grid item xs={12} md={12} xl={12}>
                                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                                    D&eacute;tails par corps d&apos;&eacute;tat
                                                </Typography>
                                                {(loadingCorps) ?
                                                    (
                                                        <Box align="center" sx={{ my: 3 }} >
                                                            < CircularProgress disableShrink={true} />
                                                            <MDTypography mb={2} color="primary" fontSize={15}>
                                                                chargement des donn&eacute;es
                                                            </MDTypography>
                                                        </Box>
                                                    ) : (

                                                        <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 500 }}>
                                                            <Table aria-label="spanning table">
                                                                <TableRow>
                                                                    <TableCell>
                                                                    </TableCell>
                                                                    <TableCell align="center" sx={{ fontWeight: 500 }}>Min</TableCell>
                                                                    <TableCell align="center" sx={{ fontWeight: 500 }}>Budget estim&eacute;</TableCell>
                                                                    <TableCell align="center" sx={{ fontWeight: 500 }}>Max</TableCell>
                                                                </TableRow>
                                                                <>
                                                                    {corps && corps.map((corp, index) => (
                                                                        <TableRow key={index}>
                                                                            <TableCell>{corp.LABEL}</TableCell>
                                                                            <TableCell align="center">
                                                                                {corp.Min}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {Object.values(corp)[Object.keys(corp).findIndex(x => x.startsWith("Budget"))]}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {corp.Max}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </>
                                                            </Table>
                                                        </TableContainer>
                                                    )}
                                            </Grid>
                                        </>
                                    )}
                            </Grid>
                        </Grid >
                    </Grid >
                    {renderModalPerso}
                </Card >
            </MDBox >
            {renderWarningSB}
            <Footer />
        </DashboardLayout >

    );
}
export default Estimate;