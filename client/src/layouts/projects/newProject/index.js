import { Fragment, useState, useEffect, useContext } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import { AuthContext } from "context/authContext";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { subtotalMin, subtotalMoy, subtotalMax, rows, style, Initialize } from "./common.tsx";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Icon, InputLabel, MenuItem, Modal, Select, Typography } from "@mui/material";
import { Divider } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MDInput from "../../../components/MDInput";
import dayjs from "dayjs";
import axios from "axios";
const steps = ["Localisation", "Titre", "Description", "Type", "Financement"];

const totalMin = subtotalMin(rows);
const totalMoy = subtotalMoy(rows);
const totalMax = subtotalMax(rows);

function NewProject() {
    const { currentUser, isLogIn, setWaitingToSignIn, url } = useContext(AuthContext);
    const [open, setOpen] = useState(isLogIn);
    const [openConfirm, setOpenConfirm] = useState(false);
    const navigate = useNavigate();
    const handleOpen = () => setOpen(true);
    const handleNavigate = () => funding == null ? setErr(true) : (currentUser == null ? (setErr(false), setWaitingToSignIn(true), navigate("/authentication/sign-in")) : handleOpen());
    const handleClose = () => setOpenConfirm(true);
    const handleCloseConfirm = () => (setOpenConfirm(false), setOpen(false));
    const [activeStep, setActiveStep] = useState(isLogIn ? 4 : 0);
    const [err, setErr] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [ville, setVille] = useState(JSON.parse(localStorage.getItem("ville")) || null);
    const [villes, setVilles] = useState(null);
    const [commune, setCommune] = useState(JSON.parse(localStorage.getItem("commune")) || null);
    const [communes, setCommunes] = useState(null);
    const [zone, setZone] = useState(JSON.parse(localStorage.getItem("zone")) || null);
    const [zones, setZones] = useState(null);
    const [quarter, setQuarter] = useState(JSON.parse(localStorage.getItem("quarter")) || null);
    const [quarters, setQuarters] = useState(null);
    const [titre, setTitre] = useState(JSON.parse(localStorage.getItem("titre")) || null);
    const [date, setDate] = useState(JSON.parse(localStorage.getItem("date")) || null);
    const [surface, setSurface] = useState(JSON.parse(localStorage.getItem("surface")) || null);
    const [topologie, setTopologie] = useState(JSON.parse(localStorage.getItem("topologie")) || null);
    const [houseType, setHouseType] = useState(JSON.parse(localStorage.getItem("houseType")) || null);
    const [standingType, setStandingType] = useState(JSON.parse(localStorage.getItem("standingType")) || null);
    const [nbrCars, setNbrCars] = useState(JSON.parse(localStorage.getItem("nbrCars")) || null);
    const [nbrRooms, setNbrRooms] = useState(JSON.parse(localStorage.getItem("nbrRooms")) || 0);
    const [funding, setFunding] = useState(JSON.parse(localStorage.getItem("funding")) || null);


    const handleChangeVille = (event: SelectChangeEvent) => {
        let ville = event.target.value;
        localStorage.setItem("ville", JSON.stringify(ville));
        localStorage.setItem("commune", JSON.stringify(null));
        localStorage.setItem("quarter", JSON.stringify(null));
        localStorage.setItem("zone", JSON.stringify(null));
        setVille(ville);
        setCommune(null);
        setQuarter(null);
        setQuarters(null);
        setZone(null);
        setZones(null);
        fetch(`${url}/api/data/communes?villeId=${ville.id}`)
            .then((res) => res.json())
            .then((data) => {
                setCommunes(data);
            });
    };

    const handleChangeCommune = (event: SelectChangeEvent) => {
        let commune = event.target.value;
        localStorage.setItem("commune", JSON.stringify(commune));
        localStorage.setItem("quarter", JSON.stringify(null));
        localStorage.setItem("zone", JSON.stringify(null));
        setCommune(commune);
        setQuarter(null);
        setZone(null);
        fetch(`${url}/api/data/quarters?communeId=${commune.id}`)
            .then((res) => res.json())
            .then((data) => {
                setQuarters(data);
            });
        fetch(`${url}/api/data/zones?communeId=${commune.id}`)
            .then((res) => res.json())
            .then((data) => {
                setZones(data);
            });
    };

    const handleChangeQuarter = (event: SelectChangeEvent) => {
        let quarter = event.target.value;
        localStorage.setItem("quarter", JSON.stringify(quarter));
        setQuarter(quarter);
    };
    const handleChangeTitre = (event: SelectChangeEvent) => {
        let titre = event.target.value;
        localStorage.setItem("titre", JSON.stringify(titre));
        setTitre(titre);
    };
    const handleChangeTypeHouse = (event: SelectChangeEvent) => {
        let house = event.target.value;
        localStorage.setItem("houseType", JSON.stringify(house));
        setHouseType(house);
    };
    const handleChangeStanding = (event: SelectChangeEvent) => {
        let standing = event.target.value;
        localStorage.setItem("standingType", JSON.stringify(standing));
        setStandingType(standing);
    };
    const handleChangeCars = (event: SelectChangeEvent) => {
        let nbr = event.target.value;
        localStorage.setItem("nbrCars", JSON.stringify(nbr));
        setNbrCars(nbr);
    };
    const handleChangeTopologie = (event: SelectChangeEvent) => {
        let topologie = event.target.value;
        localStorage.setItem("topologie", JSON.stringify(topologie));
        setTopologie(topologie);
    };
    const handleChangeFund = (event: SelectChangeEvent) => {
        let fund = event.target.value;
        localStorage.setItem("funding", JSON.stringify(fund));
        setFunding(fund);
    };

    const handleNext = () => {
        setErr(false);
        if (activeStep == 0 && (ville == null || commune == null || zone == null || quarter == null))
            setErr(true);
        else if (activeStep == 1 && titre == null)
            setErr(true);
        else if (activeStep == 2 && (surface == null || topologie == null))
            setErr(true);
        else if (activeStep == 3 && (houseType == null || nbrCars == null || nbrRooms < 1 || standingType == null))
            setErr(true);
        else
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setErr(false);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSave = async () => {
        const project = {
            villeId: ville.id,
            communeId: commune.id,
            quartierId: quarter.id,
            zoneId: zone.id,
            titre: titre,
            dateTitre: date,
            typeMaison: houseType,
            typeStanding: standingType,
            garage: nbrCars,
            nbrPiece: nbrRooms,
            surface: surface,
            topologie: topologie,
            financement: funding,
            userId: currentUser.id,
        };
        try {
            await axios.post(`${url}/api/projects/addProject`, project);
            Initialize();
            setOpenConfirm(false);
            setOpen(false);
            navigate("/mes-projets")
        } catch (err) {
            setErrMessage(err.response == undefined ? "Probl�me de connexion au BD" : err.response.data);
        }
    };
    useEffect(() => {
        fetch(`${url}/api/data/cities`)
            .then((res) => res.json())
            .then((data) => {
                setVilles(data);
            });
        if (ville != null) {
            fetch(`${url}/api/data/communes?villeId=${ville.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setCommunes(data);
                });
        }
        if (commune != null) {
            fetch(`${url}/api/data/quarters?communeId=${commune.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setQuarters(data);
                });
            fetch(`${url}/api/data/zones?communeId=${commune.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setZones(data);
                });
        }
    }, []);

    const renderModal = (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Card sx={style}>
                <MDButton sx={{ position: "absolute", top: -20, right: -20, zIndex: 1 }} variant="gradient" color="primary" size="medium" circular iconOnly onClick={handleClose}>
                    <Icon>close</Icon>
                </MDButton>
                <Grid container sx={{ overflow: "auto", scrollbarWidth: "none" }} >
                    <Grid item xs={12} md={6} xl={6} pr={3}>
                        <Box mb={2}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Estimation du projet
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: 14 }} component="h6">
                                <b>Notre proposition:</b>
                                <br />
                                {houseType} {nbrRooms}P {standingType} avec une surface utile de {surface} m&sup2;
                                <br />
                                Garage de {nbrCars}
                            </Typography>
                        </Box>
                        <Card>
                            <ProfileInfoCard
                                title="Details du projet"
                                info={{
                                    ville: `${ville?.ville}`,
                                    commune: `${commune?.commune}`,
                                    quartier: `${quarter?.quartier}`,
                                    zone: `${zone?.zone}`,
                                    surface: `${surface} m\u00b2`,
                                    "type de bien": titre,
                                    "Nombres de pieces": nbrRooms,
                                    standing: standingType,
                                    garage: nbrCars,
                                }}
                                social={[]}
                                action={{}}
                                shadow={true}
                                editable={false}
                            />
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} xl={6}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Estimation du budget de construction:
                        </Typography>
                        <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 500 }}>
                            <Table aria-label="spanning table">
                                <>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 500 }} align="center" colSpan={2}>
                                            Details
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500 }} align="center" colSpan={3}>
                                            Price
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={2} sx={{ fontWeight: 500 }}>
                                            Designation
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>Min</TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>Budget estim&eacute;</TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>Max</TableCell>
                                    </TableRow>
                                </>
                                <>
                                    {rows.map((row) => (
                                        <TableRow key={row.desc}>
                                            <TableCell colSpan={2}>{row.desc}</TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat("fr-FR").format(row.min)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat("fr-FR").format(row.moy)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat("fr-FR").format(row.max)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>Total</TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat("fr-FR").format(totalMin)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat("fr-FR").format(totalMoy)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat("fr-FR").format(totalMax)}
                                        </TableCell>
                                    </TableRow>
                                </>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Card>
        </Modal>
    );
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mt={6} mb={3}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} lg={12}>
                        <Card>
                            <MDBox sx={{ width: "100%" }} p={3}>
                                <Stepper activeStep={activeStep} style={{ height: 10 }}>
                                    {steps.map((label, index) => {
                                        const stepProps: { completed?: boolean } = {};
                                        const labelProps: {
                                            optional?: React.ReactNode,
                                        } = {};
                                        return (
                                            <Step key={label} {...stepProps}>
                                                <StepLabel {...labelProps}>{label}</StepLabel>
                                            </Step>
                                        );
                                    })}
                                </Stepper>
                                {err &&
                                    <MDTypography ml={2} mt={2} color="error" fontSize={15}>
                                        Veuillez remplir tous les champs obligatoires (*)
                                    </MDTypography>
                                }
                                {activeStep === 0 && (
                                    <Grid item xs={12} lg={12} m={3}>
                                        <Card>
                                            <MDBox pr={1} m={3}>
                                                <MDTypography ml={2}>
                                                    Renseignez la localisation de votre terrain
                                                </MDTypography>
                                                <Grid container spacing={2} p={3}>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: "10%", minWidth: "80%" }}>
                                                            <InputLabel pl={3}>Ville </InputLabel>
                                                            {villes &&
                                                                <Select sx={{ height: 44 }}
                                                                    value={villes?.find(x => x.id == ville?.id)}
                                                                    onChange={handleChangeVille}
                                                                    label="Ville *" isRequired>
                                                                    {villes &&
                                                                        villes.map((item) => (
                                                                            <MenuItem key={item.id} value={item}>
                                                                                {item.ville}
                                                                            </MenuItem>
                                                                        ))}
                                                                </Select>
                                                            }
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: "10%", minWidth: "80%" }}>
                                                            <InputLabel pl={3}>Commmune </InputLabel>
                                                            {communes && <Select sx={{ height: 44 }}
                                                                value={commune != null ? communes?.find(x => x.id == commune?.id) : null}
                                                                onChange={handleChangeCommune}
                                                                label="Commmune *"
                                                            >
                                                                {communes &&
                                                                    communes.map((item) => (
                                                                        <MenuItem key={item.id} value={item}>
                                                                            {item.commune}
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                            }
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: "10%", minWidth: "80%" }}>
                                                            <InputLabel pb={3}>Zone</InputLabel>
                                                            {zones &&
                                                                <Select sx={{ height: 44 }}
                                                                    value={zone != null ? zones?.find(x => x.id == zone?.id) : null}
                                                                    onChange={(e) => {
                                                                        setZone(e.target.value);
                                                                        localStorage.setItem("zone", JSON.stringify(e.target.value));
                                                                    }} label="Zone *">
                                                                    {zones &&
                                                                        zones.map((item) => (
                                                                            <MenuItem key={item.id} value={item}>
                                                                                {item.zone}
                                                                            </MenuItem>
                                                                        ))}
                                                                </Select>
                                                            }
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: "10%", minWidth: "80%" }}>
                                                            <InputLabel pl={3}>Quarter</InputLabel>
                                                            {quarters &&
                                                                <Select sx={{ height: 44 }}
                                                                    value={quarter != null ? quarters?.find(x => x.id == quarter?.id) : null}
                                                                    onChange={handleChangeQuarter}
                                                                    label="Quarter"
                                                                >
                                                                    {quarters &&
                                                                        quarters.map((item) => (
                                                                            <MenuItem key={item.id} value={item}>
                                                                                {item.quartier}
                                                                            </MenuItem>
                                                                        ))}
                                                                </Select>
                                                            }
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </MDBox>
                                        </Card>
                                    </Grid>
                                )}
                                {activeStep === 1 && (
                                    <Grid item xs={12} lg={12} m={3}>
                                        <Card>
                                            <MDBox pr={1} m={3}>
                                                <MDTypography ml={2}>
                                                    Avez-vous un titre de propri&eacute;t&eacute; sur ce terrain ?
                                                </MDTypography>
                                                <Grid container spacing={2} p={3}>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: "10%", mt: "8px", minWidth: "80%" }}>
                                                            <InputLabel pl={3}>Titre propri&eacute;t&eacute; </InputLabel>
                                                            <Select sx={{ height: 44 }}
                                                                value={titre}
                                                                onChange={handleChangeTitre}
                                                                label="Titre propri�t� *"
                                                            >
                                                                <MenuItem value={null}>
                                                                    <em>Aucun</em>
                                                                </MenuItem>
                                                                <MenuItem value="Attestation villageoise">
                                                                    Attestation villageoise
                                                                </MenuItem>
                                                                <MenuItem value="Lettre">Lettre</MenuItem>
                                                                <MenuItem value="ACP">ACP</MenuItem>
                                                                <MenuItem value="ADP">ADP</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: "10%", minWidth: "80%" }}>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DemoContainer components={["DatePicker"]} sx={{ mx: "10%", minWidth: "80%" }}>
                                                                    <DatePicker
                                                                        label="Date d'obtention"
                                                                        format="DD/MM/YYYY"
                                                                        value={dayjs(date)}
                                                                        onChange={(newValue) => {
                                                                            localStorage.setItem("date", JSON.stringify(newValue.format("YYYY-MM-DD")));
                                                                            setDate(newValue)
                                                                        }}
                                                                    />
                                                                </DemoContainer>
                                                            </LocalizationProvider>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </MDBox>
                                        </Card>
                                    </Grid>
                                )}
                                {activeStep === 2 && (
                                    <Grid item xs={12} lg={12} m={3}>
                                        <Card>
                                            <MDBox pr={1} m={3}>
                                                <MDTypography ml={2}>
                                                    Description du terrain ?
                                                </MDTypography>
                                                <Grid container spacing={2} p={3}>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <MDBox sx={{ mx: "10%", minWidth: "80%" }}>
                                                            <MDInput
                                                                name="surface"
                                                                type="number"
                                                                value={surface}
                                                                label="Surface *"
                                                                onChange={(e) => {
                                                                    localStorage.setItem("surface", JSON.stringify(e.target.value));
                                                                    setSurface(e.target.value);
                                                                }}
                                                            />
                                                        </MDBox>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <MDBox pr={1}>
                                                            <FormControl required sx={{ mx: "10%", minWidth: "80%" }}>
                                                                <InputLabel p={3}>Topologie </InputLabel>
                                                                <Select sx={{ height: 44 }}
                                                                    value={topologie}
                                                                    onChange={handleChangeTopologie}
                                                                    label="Topologie *"
                                                                >
                                                                    <MenuItem value="Plat">Plat</MenuItem>
                                                                    <MenuItem value="Peu accident�">Peu accident&eacute;</MenuItem>
                                                                    <MenuItem value="accident�">Accident&eacute;</MenuItem>
                                                                    <MenuItem value="tr�s accident�">
                                                                        Tr&eacute;s accident&eacute;
                                                                    </MenuItem>
                                                                    <MenuItem value="ADP">ADP</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </MDBox>
                                                    </Grid>
                                                </Grid>
                                            </MDBox>
                                        </Card>
                                    </Grid>
                                )}
                                {activeStep === 3 && (
                                    <Grid item xs={12} lg={12} m={3}>
                                        <Card>
                                            <MDBox pr={1} m={3}>
                                                <MDTypography ml={2}>
                                                    Type de bien ?
                                                </MDTypography>
                                                <Grid container spacing={2} p={3}>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: "10%", minWidth: "80%" }}>
                                                            <InputLabel pl={3}>Type de maison </InputLabel>
                                                            <Select sx={{ height: 44 }}
                                                                value={houseType}
                                                                onChange={handleChangeTypeHouse}
                                                                label="Type de maison *"
                                                            >
                                                                <MenuItem value="Maison">Maison</MenuItem>
                                                                <MenuItem value="Duplex">Duplex</MenuItem>
                                                                <MenuItem value="Triplex">Triplex</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: "10%", minWidth: "80%" }}>
                                                            <InputLabel pb={3}>Type de standing </InputLabel>
                                                            <Select sx={{ height: 44 }}
                                                                value={standingType}
                                                                onChange={handleChangeStanding}
                                                                label="Type de standing *"
                                                            >
                                                                <MenuItem value="Social">Social</MenuItem>
                                                                <MenuItem value="Economique">Economique</MenuItem>
                                                                <MenuItem value="Moyen standing">Moyen standing</MenuItem>
                                                                <MenuItem value="Haut standing">Haut standing</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: "10%", minWidth: "80%" }}>
                                                            <InputLabel pb={3}>Garage </InputLabel>
                                                            <Select sx={{ height: 44 }}
                                                                value={nbrCars}
                                                                onChange={handleChangeCars}
                                                                label="Garage *"
                                                            >
                                                                <MenuItem value="">
                                                                    <em>Aucune</em>
                                                                </MenuItem>
                                                                <MenuItem value="1 voiture">1 voiture</MenuItem>
                                                                <MenuItem value="2 voitures">2 voitures</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <MDBox sx={{ mx: "10%", minWidth: "80%" }}>
                                                            <MDInput
                                                                name="nbrPlace"
                                                                type="number"
                                                                value={nbrRooms}
                                                                label="Nombre de pi&eacute;ces *"
                                                                onChange={(e) => {
                                                                    localStorage.setItem("nbrRooms", JSON.stringify(e.target.value));
                                                                    setNbrRooms(e.target.value);
                                                                }}
                                                            />
                                                        </MDBox>
                                                    </Grid>
                                                </Grid>
                                            </MDBox>
                                        </Card>
                                    </Grid>
                                )}
                                {activeStep === 4 && (
                                    <Grid item xs={12} lg={12} m={3}>
                                        <Card>
                                            <MDBox pr={1} m={3}>
                                                <MDTypography sx={{ mt: 2, mb: 3 }}>
                                                    Comment comptez-vous financier votre projet de construction?
                                                </MDTypography>
                                                <FormControl required sx={{ mx: "10%", minWidth: "50%" }}>
                                                    <InputLabel sx={{ p: 0 }}>Financement </InputLabel>
                                                    <Select sx={{ height: 44 }}
                                                        value={funding}
                                                        onChange={handleChangeFund}
                                                        label="Financement *"
                                                    >
                                                        <MenuItem value="Epargne personnelle">Epargne personnelle</MenuItem>
                                                        <MenuItem value="Pr�t bancaire">Pr&ecirc;t bancaire</MenuItem>
                                                        <MenuItem value="Autre">Autre</MenuItem>
                                                        <MenuItem value="Je ne sais pas">Je ne sais pas</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </MDBox>
                                        </Card>
                                    </Grid>
                                )}
                                {activeStep < steps.length && (
                                    <Fragment>
                                        <MDBox sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                            <MDButton
                                                color="inherit"
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                sx={{ mr: 1 }}
                                            >
                                                Retour
                                            </MDButton>
                                            <MDBox sx={{ flex: "1 1 auto" }} />
                                            <MDButton onClick={activeStep === steps.length - 1 ? handleNavigate : handleNext}>
                                                {activeStep === steps.length - 1 ? "Estimer" : "Suivant"}
                                            </MDButton>
                                        </MDBox>
                                    </Fragment>
                                )}
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
                {renderModal}
                <Fragment>
                    <Dialog
                        open={openConfirm}
                        aria-labelledby="responsive-dialog-title"
                    >
                        {errMessage != "" &&
                            <MDTypography ml={2} mt={2} color="error" fontSize={15}>
                                {errMessage}
                            </MDTypography>
                        }
                        <DialogTitle id="responsive-dialog-title">
                            {"Voulez-vous sauvegarder ce projet?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Si vous souhaitez enregistrer ce projet dans la liste de vos projets,
                                Cliquez sur &quot;Accepter&quot; sinon cliquez sur &quot;Refuser&quot;.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <MDButton autoFocus onClick={handleCloseConfirm}>
                                Annuler
                            </MDButton>
                            <MDButton onClick={handleSave} autoFocus>
                                Enregistrer
                            </MDButton>
                        </DialogActions>
                    </Dialog>
                </Fragment>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default NewProject;
