import { Fragment, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { subtotalMin, subtotalMoy, subtotalMax } from "./common.tsx";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Box, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from "@mui/material";
import { Divider } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MDInput from "../../../components/MDInput";
import { useEffect } from "react";
const steps = ["Localisation", "Titre", "Description", "Type"];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const rows = [
  createRow("Terrassement", 228480, 245280, 262080),
  createRow("Peinture", 1795200, 1927200, 2059200),
  createRow("Plomberie sanitaire assainissement", 3264000, 3504000, 3744000),
  createRow("Menuiserie aluminium", 0, 0, 0),
  createRow("Carrelage-revetement", 1632000, 1752000, 1872000),
  createRow("Charpente couverture", 3590400, 3854400, 4118400),
  createRow("Abord-jardin", 0, 0, 0),
  createRow("Electricite", 2284800, 2452800, 2620800),
  createRow("Etancheite", 261120, 280320, 299520),
  createRow("Faux-plafond", 1680960, 1804560, 1928160),
  createRow("Ferronnerie", 930240, 998640, 1067040),
  createRow("Menuiserie quincaillerie", 3916800, 4204800, 4492800),
  createRow("Maconnerie grosoeuvre", 13056000, 14016000, 14976000),
];

function createRow(desc, min, moy, max) {
  return { desc, min, moy, max };
}

const totalMin = subtotalMin(rows);
const totalMoy = subtotalMoy(rows);
const totalMax = subtotalMax(rows);

function NewProject() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [activeStep, setActiveStep] = useState(0);
  const [ville, setVille] = useState(null);
  const [villes, setVilles] = useState(null);
  const [commune, setCommune] = useState(null);
  const [communes, setCommunes] = useState(null);
  const [zone, setZone] = useState(null);
  const [zones, setZones] = useState(null);
  const [quarter, setQuarter] = useState(null);
  const [quarters, setQuarters] = useState(null);
  const [titre, setTitre] = useState(null);
  const [date, setDate] = useState(null);
  const [surface, setSurface] = useState(null);
  const [perimetre, setPerimetre] = useState(null);
  const [topologie, setTopologie] = useState(null);
  const [houseType, setHouseType] = useState(null);
  const [standingType, setStandingType] = useState(null);
  const [nbrCars, setNbrCars] = useState(null);
  const [nbrRooms, setNbrRooms] = useState(null);

  const handleChangeVille = (event: SelectChangeEvent) => {
    let ville = event.target.value;
    setVille(ville);
    fetch(`http://localhost:8800/api/data/communes/${ville.id}`)
      .then((res) => res.json())
      .then((data) => {
        setCommunes(data);
      });
  };

  const handleChangeCommune = (event: SelectChangeEvent) => {
    let commune = event.target.value;
    setCommune(commune);
    fetch(`http://localhost:8800/api/data/quarters/${commune.id}`)
      .then((res) => res.json())
      .then((data) => {
        setQuarters(data);
      });
    fetch(`http://localhost:8800/api/data/zones/${commune.id}`)
      .then((res) => res.json())
      .then((data) => {
        setZones(data);
      });
  };

  const handleChangeZone = (event: SelectChangeEvent) => {
    let zone = event.target.value;
    setZone(zone);
  };
  const handleChangeQuarter = (event: SelectChangeEvent) => {
    let quarter = event.target.value;
    setQuarter(quarter);
  };
  const handleChangeTitre = (event: SelectChangeEvent) => {
    let titre = event.target.value;
    setTitre(titre);
  };
  const handleChangeTypeHouse = (event: SelectChangeEvent) => {
    let house = event.target.value;
    setHouseType(house);
  };
  const handleChangeStanding = (event: SelectChangeEvent) => {
    let standing = event.target.value;
    setStandingType(standing);
  };
  const handleChangeCars = (event: SelectChangeEvent) => {
    let nbr = event.target.value;
    setNbrCars(nbr);
  };
  const handleChangeTopologie = (event: SelectChangeEvent) => {
    let topologie = event.target.value;
    setTopologie(topologie);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep + 1 === steps.length) setOpen(true);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    fetch("http://localhost:8800/api/data/cities")
      .then((res) => res.json())
      .then((data) => {
        setVilles(data);
      });
  }, []);

  const renderModal = (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card sx={style}>
        <Grid container>
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
                {activeStep === 0 && (
                  <Grid item xs={12} lg={12} m={3}>
                    <Card>
                      <MDBox pr={1} m={3}>
                        <MDTypography ml={2} mb={3}>
                          Renseignez la localisation de votre terrain
                        </MDTypography>
                        <Grid container spacing={6} p={3}>
                          <Grid item xs={12} md={6} xl={6}>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                              <InputLabel pl={3}>Ville *</InputLabel>
                              <Select value={ville} onChange={handleChangeVille} label="Ville *">
                                <MenuItem value="">
                                  <em>Aucun</em>
                                </MenuItem>
                                {villes &&
                                  villes.map((item) => (
                                    <MenuItem key={item.id} value={item}>
                                      {item.ville}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6} xl={6}>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                              <InputLabel pl={3}>Commmune *</InputLabel>
                              <Select
                                value={commune}
                                onChange={handleChangeCommune}
                                label="Commmune *"
                              >
                                <MenuItem value="">
                                  <em>Aucun</em>
                                </MenuItem>
                                {communes &&
                                  communes.map((item) => (
                                    <MenuItem key={item.id} value={item}>
                                      {item.commune}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6} xl={6}>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                              <InputLabel pl={3}>Zone</InputLabel>
                              <Select value={zone} onChange={handleChangeZone} label="Zone *">
                                <MenuItem value="">
                                  <em>Aucun</em>
                                </MenuItem>
                                {zones &&
                                  zones.map((item) => (
                                    <MenuItem key={item.id} value={item}>
                                      {item.zone}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6} xl={6}>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                              <InputLabel pl={3}>Quarter</InputLabel>
                              <Select
                                value={quarter}
                                onChange={handleChangeQuarter}
                                label="Quarter"
                              >
                                <MenuItem value="">
                                  <em>Aucun</em>
                                </MenuItem>
                                {quarters &&
                                  quarters.map((item) => (
                                    <MenuItem key={item.id} value={item}>
                                      {item.quartier}
                                    </MenuItem>
                                  ))}
                              </Select>
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
                        <MDTypography ml={2} mb={3}>
                          Avez-vous un titre de propri&eacute;t&eacute; sur ce terrain ?
                        </MDTypography>
                        <Grid container spacing={6} p={3}>
                          <Grid item xs={12} md={6} xl={6}>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                              <InputLabel pl={3}>Titre propri&eacute;t&eacute; *</InputLabel>
                              <Select
                                value={titre}
                                onChange={handleChangeTitre}
                                label="Titre propriété *"
                              >
                                <MenuItem value="">
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
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DatePicker"]}>
                                  <DatePicker
                                    label="Date d'obtention"
                                    value={date}
                                    onChange={(newValue) => setDate(newValue)}
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
                        <MDTypography ml={2} mb={3}>
                          Description du terrain ?
                        </MDTypography>
                        <Grid container spacing={6} p={3}>
                          <Grid item xs={12} md={6} xl={6}>
                            <MDBox pr={1}>
                              <MDInput
                                name="surface"
                                type="text"
                                value={surface}
                                label="Surface *"
                                onChange={(e) => {
                                  setSurface(e.target.value);
                                }}
                              />
                            </MDBox>
                          </Grid>
                          <Grid item xs={12} md={6} xl={6}>
                            <MDBox pr={1}>
                              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel p={3}>Topologie *</InputLabel>
                                <Select
                                  style={{ height: "30px" }}
                                  value={topologie}
                                  onChange={handleChangeTopologie}
                                  label="Topologie *"
                                >
                                  <MenuItem value="Plat">Plat</MenuItem>
                                  <MenuItem value="Peu accidenté">Peu accident&eacute;</MenuItem>
                                  <MenuItem value="accidenté">Accident&eacute;</MenuItem>
                                  <MenuItem value="très accidenté">
                                    Tr&eacute;s accident&eacute;
                                  </MenuItem>
                                  <MenuItem value="ADP">ADP</MenuItem>
                                </Select>
                              </FormControl>
                            </MDBox>
                          </Grid>
                          <Grid item xs={12} md={6} xl={6}>
                            <MDBox pr={1}>
                              <MDInput
                                name="perimetre"
                                type="text"
                                value={perimetre}
                                label="P&eacute;rim&ecirc;tre"
                                onChange={(e) => {
                                  setPerimetre(e.target.value);
                                }}
                              />
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
                        <MDTypography ml={2} mb={3}>
                          Type de bien ?
                        </MDTypography>
                        <Grid container spacing={6} p={3}>
                          <Grid item xs={12} md={6} xl={6}>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                              <InputLabel pl={3}>Type de maison *</InputLabel>
                              <Select
                                style={{ height: "30px" }}
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
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                              <InputLabel pb={3}>Type de standing *</InputLabel>
                              <Select
                                style={{ height: "30px" }}
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
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                              <InputLabel pb={3}>Garage *</InputLabel>
                              <Select
                                style={{ height: "30px" }}
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
                            <MDBox pr={1}>
                              <MDInput
                                name="nbrPlace"
                                type="number"
                                value={nbrRooms}
                                label="Nombre de pi&eacute;ces *"
                                onChange={(e) => {
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
                {activeStep === steps.length ? (
                  <Fragment>
                    <MDTypography sx={{ mt: 2, mb: 1 }}>
                      Toutes les &eacute;tapes sont termin&eacute;es
                    </MDTypography>
                    <MDBox sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <MDBox sx={{ flex: "1 1 auto" }} />
                      <MDButton color="inherit" onClick={handleOpen}>
                        Voir l&apos;estimation
                      </MDButton>
                    </MDBox>
                  </Fragment>
                ) : (
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
                      <MDButton onClick={handleNext}>
                        {activeStep === steps.length - 1 ? "Terminer" : "Suivant"}
                      </MDButton>
                    </MDBox>
                  </Fragment>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        {renderModal}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NewProject;
