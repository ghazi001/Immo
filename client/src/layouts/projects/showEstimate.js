import { useState, useEffect, useContext } from "react";
import { styled } from '@mui/material/styles';
import { Box, CircularProgress, FormControl, Icon, MenuItem, Modal, TableBody, Typography, InputLabel, Select } from "@mui/material";
import MDButton from "components/MDButton";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import MuiTableHead from "@material-ui/core/TableHead";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { style, styleModal } from "./newProject/common.tsx";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDInput from "../../components/MDInput";
import axios from "axios";
import { AuthContext } from "context/authContext";
import { Initialize } from "./newProject/common.tsx";
import { useNavigate } from "react-router-dom";


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

const TableHead = withStyles((theme) => ({
    root: {
        backgroundColor: "orange"
    }
}))(MuiTableHead);

const TableHeaderCell = withStyles((theme) => ({
    root: {
        color: "white",
        fontWeight: 500,
    }
}))(TableCell);

const TableBodyCell = withStyles((theme) => ({
    root: {
        height: 40
    }
}))(TableCell);

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function ShowEstimate({ project, setOpen, setWarningSB }) {
    const { currentUser, url } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpenPerso(true);
    const handleClosePerso = () => setOpenPerso(false);
    const [openPerso, setOpenPerso] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [budget, setBudget] = useState(null);
    const [loadingBudget, setLoadingBudget] = useState(true);
    const [loadingCorps, setLoadingCorps] = useState(true);
    const [corps, setCorps] = useState(null);
    const [nombre, setNombre] = useState(0);
    const [surface, setSurface] = useState(0);
    const [piece, setPiece] = useState("");
    const [listPerso, setListPers] = useState([]);


    const handleSave = async () => {
        if (project.id != undefined) {
            var list = listPerso;
            try {
                await axios.post(`${url}/api/projects/addPerso?projectId=${project.id}`, list);
                setOpen(false);
                navigate("/mes-projets")
            } catch (err) {
                setErrMessage(err.response == undefined ? "Probl\u00e9me de connexion au BD" : err.response.data);
                setOpenPerso(false);
            }
        }
        else {

            const newProject = {
                villeId: project.ville.id,
                communeId: project.commune.id,
                quartierId: project.quarter.id,
                zoneId: project.zone.id,
                titre: project.titre,
                dateTitre: project.date,
                typeMaison: project.houseType,
                typeStanding: project.standingType,
                garage: project.garage,
                nbrPiece: project.nbrRooms,
                surface: project.surface,
                topologie: project.topologie,
                financement: project.funding,
                userId: currentUser.id,
            };
            try {
                let result = await axios.post(`${url}/api/projects/addProject`, newProject);
                if (result.status == 200) {
                    let id = result.data;
                    Initialize();
                    var list = listPerso;
                    await axios.post(`${url}/api/projects/addPerso?projectId=${id}`, list);
                    setOpen(false);
                    navigate("/mes-projets")
                }
            } catch (err) {
                setErrMessage(err.response == undefined ? "Probl\u00e9me de connexion au BD" : err.response.data);
            }
        }
    };

    const handleAddPerso = async () => {
        if (surface > 0 && nombre > 0 && piece != "") {
            const newPerso = {
                id: 0,
                piece: piece,
                surface: surface,
                nombre: nombre,
            };

            var list = listPerso;
            list.push(newPerso);
            setListPers(list);
            setSurface(0);
            setNombre(0);
            setPiece("");
        } else {
            setWarningSB(true);
        }
    };

    const handleSavePerso = async () => {
        var stand = "MST";
        var TYP = "DUX";
        var nbr = 3;
        var list = listPerso;
        project.nbrRooms = list.reduce((total, currentValue) => total = parseInt(total) + parseInt(currentValue.nombre), 0);
        project.surface = list.reduce((total, currentValue) => total = parseFloat(total) + parseFloat(parseInt(currentValue.nombre) * parseFloat(currentValue.surface)), 0);
        try {
            fetch(`http://188.165.231.114:8060/immo/backend/estimationBudget?TYP=${TYP}&STAND=${stand}&NBPCS=${nbr}`)
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
            fetch(`http://188.165.231.114:8060/immo/backend/detailCorpEtat?TYP=${TYP}&STAND=${stand}&NBPCS=${nbr}`)
                .then((res) => res.json())
                .then((data) => {
                    setCorps(data);
                    setLoadingCorps(false);
                });
        } catch (Exception) {
            setCorps(null);
            setLoadingCorps(false);
        }

        setOpenPerso(false);

    };

    const handleRemovePerso = async (indice) => {
        var list = listPerso;
        list = list.filter((perso, index) => index != indice);
        setListPers(list);
    };

    useEffect(() => {
        var stand = "MST";
        var TYP = "DUX";
        var nbr = 3;
        if (project.id != undefined) {
            fetch(`${url}/api/projects/getPerso?projectId=${project.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setListPers(data);
                });
        }
        try {
            fetch(`http://188.165.231.114:8060/immo/backend/estimationBudget?TYP=${TYP}&STAND=${stand}&NBPCS=${nbr}`)
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
            fetch(`http://188.165.231.114:8060/immo/backend/detailCorpEtat?TYP=${TYP}&STAND=${stand}&NBPCS=${nbr}`)
                .then((res) => res.json())
                .then((data) => {
                    setCorps(data);
                    setLoadingCorps(false);
                });
        } catch (Exception) {
            setCorps(null);
            setLoadingCorps(false);
        }
    }, [])


    const renderModalPerso = (
        <Modal
            open={openPerso}
            onClose={handleClosePerso}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ScrolingCard xs={12} md={12} xl={12} >
                <MDBox>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Personnalisation
                    </Typography>
                    <Grid container mt={2}>
                        <Grid item xs={6} md={4} xl={4} pr={3} mb={2}>
                            <FormControl required sx={{ width: "100%" }}>
                                <InputLabel pl={3}>Pi&eacute;ce</InputLabel>
                                <Select sx={{ height: 44 }}
                                    value={piece}
                                    onChange={(e) => setPiece(e.target.value)}
                                    label="Piece"
                                >
                                    <MenuItem value="Salon">Salon</MenuItem>
                                    <MenuItem value="Chambre">Chambre</MenuItem>
                                    <MenuItem value="Cuisine">Cuisine</MenuItem>
                                    <MenuItem value="Salle de bain">Salle de bain</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} md={3} xl={3} pr={3} mb={2}>
                            <MDInput
                                name="surface"
                                type="number"
                                value={surface}
                                label="Surface *"
                                onChange={(e) => {
                                    setSurface(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} md={3} xl={3} pr={3} mb={2}>
                            <MDInput
                                name="nombre"
                                type="number"
                                value={nombre}
                                label="Nombre *"
                                onChange={(e) => {
                                    setNombre(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} md={2} xl={2} pr={3} mb={2}>
                            <MDButton variant="gradient" size="small" sx={{ margin: "0 2px" }} color="secondary" onClick={handleAddPerso} iconOnly>
                                <Icon>add</Icon>
                            </MDButton>
                        </Grid>

                    </Grid>
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>Pi&eacute;ce</TableHeaderCell>
                                    <TableHeaderCell align="left">Surface</TableHeaderCell>
                                    <TableHeaderCell align="left">Nombre</TableHeaderCell>
                                    <TableHeaderCell align="left"></TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {listPerso.length != 0 ?
                                    (
                                        <>
                                            {listPerso.map((perso, indice) => (
                                                <StyledTableRow key={indice}>
                                                    <TableCell align="left">{perso.piece}</TableCell>
                                                    <TableCell align="left">{perso.surface}</TableCell>
                                                    <TableCell align="left">{perso.nombre}</TableCell>
                                                    <TableCell align="center">
                                                        <MDButton variant="gradient" size="small" sx={{ margin: "0 2px" }} color="error" onClick={() => { handleRemovePerso(indice) }} iconOnly>
                                                            <Icon>delete</Icon>
                                                        </MDButton>
                                                    </TableCell>
                                                </StyledTableRow>
                                            ))}
                                        </>
                                    ) : (
                                        <>

                                            <StyledTableRow >
                                                <TableBodyCell align="left"></TableBodyCell>
                                                <TableBodyCell align="left"></TableBodyCell>
                                                <TableBodyCell align="left"></TableBodyCell>
                                                <TableBodyCell align="left"></TableBodyCell>
                                            </StyledTableRow>
                                            <StyledTableRow >
                                                <TableBodyCell align="left"></TableBodyCell>
                                                <TableBodyCell align="left"></TableBodyCell>
                                                <TableBodyCell align="left"></TableBodyCell>
                                                <TableBodyCell align="left"></TableBodyCell>
                                            </StyledTableRow>
                                        </>

                                    )}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </MDBox>
                <MDBox sx={{ display: "flex", flexDirection: "row", pt: 2, justifyContent: "center" }} mt={2}>
                    <MDButton variant="gradient" size="small" sx={{ margin: "0 2px" }} color="error" onClick={handleClosePerso} >
                        Annuler
                    </MDButton>
                    <MDButton variant="gradient" size="small" sx={{ margin: "0 2px" }} color="success" onClick={handleSavePerso} >
                        Enregistrer
                    </MDButton>
                </MDBox>
            </ScrolingCard>
        </Modal >
    );
    return (
        <Card sx={style} xs={12} md={8} xl={6} >
            <MDButton sx={{ position: "absolute", top: -20, right: -20, zIndex: 1 }} variant="gradient" color="primary" size="medium" circular iconOnly onClick={handleClose}>
                <Icon>close</Icon>
            </MDButton>
            <Grid container sx={{ overflow: "auto", scrollbarWidth: "none" }} mb={1} p={1}>
                <Grid item xs={12} md={12} xl={12} pr={3} mb={2}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Estimation du projet
                    </Typography>
                    <MDButton variant="gradient" color="primary" sx={{ float: "right", marginTop: 3, padding: 1 }} onClick={handleOpen} autoFocus>
                        Personnaliser
                    </MDButton>
                    <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: 14, ml: 3 }} component="h6">
                        <b>Notre proposition:</b>
                        <br />
                        {project.houseType} {project.nbrRooms}P {project.standingType} avec une surface utile de {parseFloat(project.surface)} m&sup2;
                        <br />
                        Garage de {project.garage}
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
            </Grid>
            <MDBox sx={{ textAlign: "center" }}>
                {errMessage != "" &&
                    <MDTypography mb={2} color="error" fontSize={15}>
                        {errMessage}
                    </MDTypography>
                }
                <MDButton variant="gradient" sx={{ margin: "0 2px" }} color="error" onClick={handleClose} autoFocus>
                    Annuler
                </MDButton>
                <MDButton variant="gradient" sx={{ margin: "0 2px" }} color="info" onClick={handleSave}>
                    Enregistrer
                </MDButton>
            </MDBox>
            {renderModalPerso}

        </Card >
    );
}
export default ShowEstimate;