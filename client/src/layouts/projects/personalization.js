import { useState, useEffect, useContext } from "react";
import { styled } from '@mui/material/styles';
import { CircularProgress, FormControl, Icon, MenuItem, TableBody, Typography, InputLabel, Select } from "@mui/material";
import MDButton from "components/MDButton";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import MuiTableHead from "@material-ui/core/TableHead";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDInput from "../../components/MDInput";
import axios from "axios";
import { AuthContext } from "context/authContext";


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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function Perso({ project, setProject, garageList, standingList, setBudget, setCorps, constructionList, piecesList, setOpen, setWarningSB }) {
    const { currentUser, url } = useContext(AuthContext);
    const CalculatedPieces = ["SEJ", "SAM", "CH1", "CH2", "BUR"];
    const [nombrePiece, setNombrePiece] = useState(project.nbrPiece);
    const [nombre, setNombre] = useState(0);
    const [surface, setSurface] = useState(0);
    const [piece, setPiece] = useState("");
    const [pieceLabel, setPieceLabel] = useState("");
    const [listPerso, setListPers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [inputs, setInputs] = useState({
        houseType: project.typeMaison,
        standingType: project.typeStanding,
        garage: project.garage,
    });

    const handleChange = async (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        var updatedProject = project;
        switch (e.target.name) {
            case "houseType": updatedProject.typeMaison = e.target.value; updatedProject.typeMaisonLabel = constructionList.find(item => item.TYP === e.target.value).LABEL; break;
            case "standingType": updatedProject.typeStanding = e.target.value; updatedProject.typeStandingLabel = standingList.find(item => item.STAND === e.target.value).LABEL; break;
            case "garage": updatedProject.garage = e.target.value; break;
        }
        setProject(updatedProject);
        if (project.id != undefined) {
            try {
                let result = await axios.post(`${url}/api/projects/updateProjectTypeStandingGarage?projectId=${project.id}&TYP=${updatedProject.typeMaison}&STAND=${updatedProject.typeStanding}&GARAGE=${updatedProject.garage}`);
                if (result.status == 200) {
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
        }
    };


    const handleAddPerso = async () => {
        if (surface > 0 && nombre > 0 && piece != "") {
            const newPerso = {
                id: 0,
                piece: piece,
                pieceLabel: pieceLabel,
                surface: surface,
                nombre: nombre,
            };

            var list = listPerso;
            list.push(newPerso);
            setListPers(list);
            var updatedProject = project;
            if (CalculatedPieces.includes(piece)) {
                setNombrePiece(parseInt(nombrePiece) + parseInt(nombre));
                updatedProject.nbrPiece = parseInt(nombrePiece) + parseInt(nombre);
            }
            updatedProject.surfaceUtile += parseFloat(nombre * surface);
            setProject(updatedProject);
            setSurface(0);
            setNombre(0);
            setPiece("");
            setPieceLabel("");
            if (project.id != undefined) {
                try {
                    await axios.post(`${url}/api/projects/addPerso?projectId=${project.id}`, list);
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
                } catch (err) {
                }
            }
        } else {
            setWarningSB(true);
        }
    };

    const handleRemovePerso = async (indice) => {
        var list = listPerso;
        var updatedProject = project;
        if (CalculatedPieces.includes(list[indice].piece)) {
            setNombrePiece(parseInt(nombrePiece) - parseInt(list[indice].nombre));
            updatedProject.nbrPiece = parseInt(nombrePiece) - parseInt(list[indice].nombre);
        }
        updatedProject.surfaceUtile -= parseFloat(list[indice].nombre * list[indice].surface);
        setProject(updatedProject);
        list = list.filter((perso, index) => index != indice);
        setListPers(list);
        if (project.id != undefined) {
            try {
                await axios.post(`${url}/api/projects/addPerso?projectId=${project.id}`, list);
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
            } catch (err) {
            }
        }
    };


    useEffect(() => {
        fetch(`${url}/api/projects/getPerso?projectId=${project.id}`)
            .then((res) => res.json())
            .then((data) => {
                setListPers(data);
                setLoading(false);
            });
    }, [])

    return (
        <MDBox>
            <Typography id="modal-modal-title" variant="h5" component="h2" mb={2}>
                Personnalisation
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2" fontSize={13}>
                Souhaitez vous modifier le type, le standing ou le type de garage
            </Typography>
            <Grid container mt={2}>
                <Grid item xs={6} md={3} xl={3} pr={3} mb={2}>
                    <FormControl required sx={{ minWidth: "100%" }}>
                        <InputLabel pl={3}>Type de maison </InputLabel>
                        <Select sx={{ height: 44 }}
                            name="houseType"
                            value={inputs.houseType}
                            onChange={handleChange}
                            label="Type de maison *"
                        >
                            {constructionList.map((construction) => (
                                <MenuItem key={construction.TYP} value={construction.TYP}>{construction.LABEL}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={3} xl={3} pr={3} mb={2}>
                    <FormControl required sx={{ minWidth: "100%" }}>
                        <InputLabel pb={3}>Type de standing </InputLabel>
                        <Select sx={{ height: 44 }}
                            name="standingType"
                            value={inputs.standingType}
                            onChange={handleChange}
                            label="Type de standing *"
                        >
                            {standingList.map((stand) => (
                                <MenuItem key={stand.STAND} value={stand.STAND}>{stand.LABEL}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={3} xl={3} pr={3} mb={2}>
                    <FormControl required sx={{ minWidth: "100%" }}>
                        <InputLabel pb={3}>Garage </InputLabel>
                        <Select sx={{ height: 44 }}
                            name="garage"
                            value={inputs.garage}
                            onChange={handleChange}
                            label="Garage *"
                        >
                            {garageList.map((garage) => (
                                <MenuItem key={garage.id} value={garage.Description}>{garage.Description}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={3} xl={3} pr={3} mb={2}>
                    <MDInput
                        name="nombre"
                        type="text"
                        value={nombrePiece}
                        label="Nombre de pi&egrave;ces"
                        disabled={true}
                    />
                </Grid>
            </Grid>
            <Typography id="modal-modal-title" variant="h6" component="h2" fontSize={13}>
                Souhaitez vous ajouter ou retirer des pi&egrave;ces
            </Typography>
            <Grid container mt={2}>
                <Grid item xs={6} md={4} xl={4} pr={3} mb={2}>
                    <FormControl required sx={{ width: "100%" }}>
                        <InputLabel pl={3}>Pi&eacute;ce</InputLabel>
                        <Select sx={{ height: 44 }}
                            value={piece}
                            name={pieceLabel}
                            onChange={(e, p) => {
                                setPiece(e.target.value); setPieceLabel(p.props.name)
                            }}
                            label="Piece"
                        >
                            {piecesList && piecesList.map((item) => (
                                < MenuItem key={item.TYP} name={item.LABEL} value={item.TYP} > {item.LABEL} </MenuItem>
                            ))}
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
                <Table aria-label="customized table" loading={loading}>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Pi&eacute;ce</TableHeaderCell>
                            <TableHeaderCell align="left">Surface</TableHeaderCell>
                            <TableHeaderCell align="left">Nombre</TableHeaderCell>
                            <TableHeaderCell align="left"></TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading &&
                            <StyledTableRow colSpan={4}>
                                <TableCell></TableCell>
                                <TableCell>
                                    <MDBox align="center" sx={{ my: 3 }} width="100%">
                                        < CircularProgress disableShrink={true} />
                                        <MDTypography mb={2} color="primary" fontSize={15}>
                                            chargement des donn&eacute;es
                                        </MDTypography>
                                    </MDBox>
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>

                            </StyledTableRow>

                        }
                        {!loading && listPerso.map((perso, indice) => (
                            <StyledTableRow key={indice}>
                                <TableCell align="left">{perso.pieceLabel}</TableCell>
                                <TableCell align="left">{perso.surface}</TableCell>
                                <TableCell align="left">{perso.nombre}</TableCell>
                                <TableCell align="center">
                                    <MDButton variant="gradient" size="small" sx={{ margin: "0 2px" }} color="error" onClick={() => { handleRemovePerso(indice) }} iconOnly>
                                        <Icon>delete</Icon>
                                    </MDButton>
                                </TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <MDBox align="center" sx={{ my: 3 }}>
                <MDButton variant="gradient" color="success" sx={{ margin: "0 2px" }} onClick={() => setOpen(false)}>
                    Terminer
                </MDButton>
            </MDBox>

        </MDBox>
    );
}
export default Perso;