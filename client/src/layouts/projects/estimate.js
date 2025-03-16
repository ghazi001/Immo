import { useState, useEffect, useContext } from "react";
import { styled } from '@mui/material/styles';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, MenuItem, Modal, Select, Typography } from "@mui/material";
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
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { devises } from "./newProject/common.tsx";

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
    const [openDetail, setOpenDetail] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleOpenDetail = () => setOpenDetail(true);
    const [piecesList, setPiecesList] = useState([]);
    const [constructionList, setConstructionList] = useState([]);
    const [standingList, setStandingList] = useState([]);
    const [garageList, setGarageList] = useState([]);
    const [warningSB, setWarningSB] = useState(false);
    const [devise, setDevise] = useState("FCFA");
    const closeWarningSB = () => setWarningSB(false);
    const theme = useTheme();
    const phoneConsole = useMediaQuery(theme.breakpoints.down("sm"));

    const handleChangeDevise = async (event: SelectChangeEvent) => {
        let devise = event.target.value;
        let updatedProject = project;
        try {
            const res = await axios.post(`${url}/api/projects/updateDevise?projectId=${project.id}&devise=${devise}`);
            if (res.status == 200) {
                updatedProject.devise = devise;
                setProject(updatedProject);
                try {
                    fetch(`${url}/api/projects/getEstimationByIdProject?idProject=${project.id}`)
                        .then((res) => res.json())
                        .then((data) => {
                            setBudget(data[0]);
                        });
                } catch (Exception) {
                    setBudget(null);
                }
                try {
                    fetch(`${url}/api/projects/detailCorpEtatByIdProject?projectId=${project.id}`)
                        .then((res) => res.json())
                        .then((data) => {
                            setCorps(data);
                        });
                } catch (Exception) {
                    setCorps(null);
                }
            }
        } catch (err) {
        }

    };

    useEffect(() => {
        if (!currentUser)
            navigate("/nouveau-projet")
        else {
            try {
                axios.get(`${url}/api/projects/getProjectByUserId?projectId=${id}&userId=${currentUser.id}`)
                    .then((res) => {
                        setProject(res.data);
                        setDevise(res.data.devise ?? "FCFA");
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
            <ScrolingCard sx={{ width: { xs: "100%", sm: "50%" } }} >
                <Perso project={project} setProject={setProject} piecesList={piecesList} setBudget={setBudget} setCorps={setCorps}
                    constructionList={constructionList} standingList={standingList} garageList={garageList} setOpen={setOpen} setWarningSB={setWarningSB}
                />
            </ScrolingCard>
        </Modal >
    );

    const renderModalDetail = (
        <Modal
            open={openDetail}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ScrolingCard sx={{ width: { xs: "100%", sm: "50%" } }} >
                <Grid item xs={12} md={12} xl={12} textAlign="center">
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontSize: 14, float: "left", my: 2 }}>
                        D&eacute;tails par corps d&apos;&eacute;tat
                    </Typography>
                    {(loadingCorps) ?
                        (
                            <Box align="center" sx={{ my: 3 }} >
                                < CircularProgress disableShrink={true} />
                                <MDTypography mb={2} color="primary" fontSize={15} >
                                    chargement des donn&eacute;es
                                </MDTypography>
                            </Box>
                        ) : (
                            <>
                                <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 500 }}>
                                    <Table aria-label="spanning table">
                                        <TableRow>
                                            <TableCell sx={{ fontSize: 14, fontWeight:500 }}>Min</TableCell>
                                            <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>Budget estim&eacute;</TableCell>
                                            <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>Max</TableCell>
                                        </TableRow>
                                            {corps && corps.map((corp, index) => (
                                                <>

                                                    <TableRow key={index}>
                                                        <TableCell sx={{ borderBottom: "none", pb:0 }} colSpan={3}>
                                                            <b style={{ fontSize: 14 }}>{corp.LABEL}</b><br />
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ fontSize: 12 }}>
                                                            {corp.Min}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: 12 }}>
                                                            {Object.values(corp)[Object.keys(corp).findIndex(x => x.startsWith("Budget"))]}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: 12 }}>
                                                            {corp.Max}
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            ))}
                                    </Table>
                                </TableContainer>
                                <MDButton variant="gradient" color="success" sx={{ mt: 2 }} onClick={() => setOpenDetail(false)}>
                                    Terminer
                                </MDButton>
                            </>
                        )}
                </Grid>
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
                                            <Grid item xs={12} md={12} xl={12} pr={{ xs: 0, md: 3 }} mb={2}>
                                                <MDTypography id="modal-modal-title" sx={{ display:"flex", fontSize: { xs: 15, md: 17 }, fontWeight: 700 }}>
                                                    Estimation du projet
                                                    <Grid>
                                                        <Select
                                                            value={devise}
                                                            onChange={handleChangeDevise}
                                                            sx={{ marginLeft: "50%" }} >
                                                        {devises.map((dvs) => (
                                                            <MenuItem key={dvs} value={dvs}>
                                                                {dvs}
                                                            </MenuItem>
                                                        ))}
                                                        </Select>
                                                    </Grid>
                                                </MDTypography>
                                                <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: 14, ml: { xs: 0, sm: 1, md: 3 } }} component="h6">
                                                    <b>Notre proposition:</b>
                                                    <br />
                                                    {project.typeMaisonLabel} de {project.nbrPiece} Pi&eacute;ce(s) {project.typeStandingLabel} avec une surface utile de {parseFloat(project.surfaceUtile)} m&sup2;
                                                    <br />
                                                    Garage: {project.garage}
                                                    <MDButton variant="contained" color="primary" sx={{ display: { xs: "none", sm: "block" }, position: "absolute", top: 0, right: 0, margin: 3 }} onClick={handleOpen} focus={false}>
                                                        Personnaliser
                                                    </MDButton>
                                                    <MDTypography sx={{ display: { xs: "block", sm: "none" }, color: "red", position: "sticky", float: "right", fontWeight: 700 }} fontSize={15} onClick={handleOpen}>
                                                        Personnaliser
                                                    </MDTypography>
                                                </Typography>

                                            </Grid>
                                            <Grid item xs={12} md={12} xl={12}>
                                                <MDTypography id="modal-modal-title" sx={{ fontSize: { xs: 15, md: 17 }, fontWeight: 700 }}>
                                                    Estimation du budget de construction
                                                </MDTypography>
                                                {(loadingBudget) ?
                                                    (
                                                        <Box align="center" sx={{ my: 3 }} >
                                                            < CircularProgress disableShrink={true} />
                                                            <MDTypography mb={2} color="primary" fontSize={15}>
                                                                chargement des donn&eacute;es
                                                            </MDTypography>
                                                        </Box>
                                                    ) : (
                                                        <>
                                                            {phoneConsole ?
                                                                (
                                                                    <div>
                                                                        <MDTypography sx={{ display: { xs: "block", sm: "none" }, color: "red", position: "sticky", float: "right", fontWeight: 500 }} fontSize={15} onClick={handleOpenDetail}>
                                                                            D&eacute;tailler
                                                                        </MDTypography>
                                                                        <TableContainer component={Paper} sx={{ width: "max-content", mt:3  }}>
                                                                            <Table>
                                                                                <TableRow>
                                                                                    <TableCell align="left" sx={{ fontWeight: 500 }}>Min</TableCell>
                                                                                    <TableCell align="center">{budget != null ? budget.Min : 0}</TableCell>
                                                                                </TableRow>
                                                                                <TableRow
                                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                                >
                                                                                    <TableCell align="left" sx={{ fontWeight: 500 }}>Budget estim&eacute;</TableCell>
                                                                                    <TableCell align="center">{budget != null ? Object.values(budget)[Object.keys(budget).findIndex(x => x.startsWith("Budget"))] : 0}</TableCell>
                                                                                </TableRow>
                                                                                <TableRow
                                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                                >
                                                                                    <TableCell align="left" sx={{ fontWeight: 500 }}>Max</TableCell>
                                                                                    <TableCell align="center">{budget != null ? budget.max : 0}</TableCell>
                                                                                </TableRow>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    </div>
                                                                ) : (
                                                                    <>
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
                                                                    </>
                                                                )
                                                            }
                                                        </>

                                                    )}
                                            </Grid>
                                            <Grid item xs={12} md={12} xl={12} sx={{ display: { xs: "none", sm: "block" } }}>
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
                    {renderModalDetail}
                </Card >
            </MDBox >
            {renderWarningSB}
            <Footer />
        </DashboardLayout >

    );
}
export default Estimate;