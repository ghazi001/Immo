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
import { AuthContext } from "context/authContext";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { FormControl, InputLabel, MenuItem, Modal, Select } from "@mui/material";

import MDInput from "../../../components/MDInput";
import dayjs from "dayjs";
import MDSnackbar from "../../../components/MDSnackbar";
const steps = ["Localisation", "Titre", "Description", "Type", "Financement"];
import axios from "axios";
import { Initialize } from "./common.tsx";
import backgroundImage from "assets/images/Immo.jpg";


function NewProject() {
    const { currentUser, isLogIn, url, setNewProject } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleNavigate = () => { funding == null ? setErr(true) : handleOpen() };
    const [activeStep, setActiveStep] = useState(isLogIn ? 4 : 0);
    const [err, setErr] = useState(false);
    const [ville, setVille] = useState(JSON.parse(localStorage.getItem("ville")) || null);
    const [villes, setVilles] = useState(null);
    const [commune, setCommune] = useState(JSON.parse(localStorage.getItem("commune")) || null);
    const [communes, setCommunes] = useState(null);
    const [zone, setZone] = useState(JSON.parse(localStorage.getItem("zone")) || null);
    const [otherZone, setOtherZone] = useState(JSON.parse(localStorage.getItem("otherZone")) || null);
    const [zones, setZones] = useState(null);
    const [quarter, setQuarter] = useState(JSON.parse(localStorage.getItem("quarter")) || null);
    const [otherQuarter, setOtherQuarter] = useState(JSON.parse(localStorage.getItem("otherQuarter")) || null);
    const [quarters, setQuarters] = useState(null);
    const [pieces, setPieces] = useState([]);
    const [titre, setTitre] = useState(JSON.parse(localStorage.getItem("titre")) || null);
    const [date, setDate] = useState(JSON.parse(localStorage.getItem("date")) || null);
    const [surface, setSurface] = useState(JSON.parse(localStorage.getItem("surface")) || null);
    const [topologie, setTopologie] = useState(JSON.parse(localStorage.getItem("topologie")) || null);
    const [houseType, setHouseType] = useState(JSON.parse(localStorage.getItem("houseType")) || null);
    const [standingType, setStandingType] = useState(JSON.parse(localStorage.getItem("standingType")) || null);
    const [nbrCars, setNbrCars] = useState(JSON.parse(localStorage.getItem("garage")) || null);
    const [nbrRooms, setNbrRooms] = useState(JSON.parse(localStorage.getItem("nbrRooms")) || 0);
    const [funding, setFunding] = useState(JSON.parse(localStorage.getItem("funding")) || null);
    const [funList, setFunList] = useState([]);
    const [constructionList, setConstructionList] = useState([]);
    const [standingList, setStandingList] = useState([]);
    const [topologieList, setTopologieList] = useState([]);
    const [titleList, setTitleList] = useState([]);
    const [garageList, setGarageList] = useState([]);
    const [warningSB, setWarningSB] = useState(false);
    const [isOtherZone, setIsOtherZone] = useState((JSON.parse(localStorage.getItem("zone")))?.zone == "Autre" || false);
    const [isOtherQuarter, setIsOtherQuarter] = useState((JSON.parse(localStorage.getItem("quarter")))?.quartier == "Autre" || false);
    const closeWarningSB = () => setWarningSB(false);
    const [errMessage, setErrMessage] = useState("");


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
    };

    const handleChangeQuarter = (event: SelectChangeEvent) => {
        let quarter = event.target.value;
        localStorage.setItem("quarter", JSON.stringify(quarter));
        localStorage.setItem("zone", JSON.stringify(null));
        setQuarter(quarter);
        setIsOtherQuarter(quarter.id == 0 && quarter.quartier == "Autre");
        setIsOtherZone(false);
        setOtherZone(null);
        setOtherQuarter(null);
        localStorage.setItem("otherQuarter", JSON.stringify(null));
        localStorage.setItem("otherZone", JSON.stringify(null));
        setZone(null);
        fetch(`${url}/api/data/zones?quartier=${quarter.id}`)
            .then((res) => res.json())
            .then((data) => {
                setZones(data);
            });
    };

    const handleChangeZone = (event: SelectChangeEvent) => {
        let zone = event.target.value;
        setZone(zone);
        localStorage.setItem("zone", JSON.stringify(zone));
        setIsOtherZone(zone.id == 0 && zone.zone == "Autre");
        setOtherZone(null);
        localStorage.setItem("otherZone", JSON.stringify(null));
    };

    const handleOpen = async () => {
        const newProject = {
            villeId: ville.id,
            communeId: commune.id,
            quartierId: quarter.id,
            quartierLabel: (quarter.id == 0 && quarter.quartier == "Autre") ? otherQuarter : quarter.quartier,
            zoneId: zone.id,
            zoneLabel: (zone.id == 0 && zone.zone == "Autre") ? otherZone : zone.zone,
            titre: titre,
            dateTitre: date,
            typeMaison: houseType,
            typeStanding: standingType,
            garage: nbrCars,
            nbrPiece: nbrRooms,
            surface: surface,
            topologie: topologie,
            financement: funding,
        };
        if (currentUser == null) {
            setNewProject(newProject);
            navigate("/authentication/sign-in");
        }
        else {
            newProject.userId = currentUser.id;
            try {
                let result = await axios.post(`${url}/api/projects/addProject`, newProject);
                if (result.status == 200) {
                    let id = result.data;
                    Initialize();
                    navigate(`/mes-projets/estimation/${id}`);
                }
            } catch (err) {
                setErrMessage(err.response == undefined ? "Probl\u00e9me de connexion au BD" : err.response.data);
            }
        }
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
        localStorage.setItem("garage", JSON.stringify(nbr));
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

    useEffect(() => {
        try {
            fetch(`${url}/api/data/getNombreDePieces`)
                .then((res) => res.json())
                .then((data) => {
                    setPieces(data);
                })
                .catch(error => {
                    console.error(error);
                });
            fetch(`${url}/api/data/cities`)
                .then((res) => res.json())
                .then((data) => {
                    setVilles(data);
                })
                .catch(error => {
                    console.error(error);
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

            }
            if (quarter != null) {
                fetch(`${url}/api/data/zones?quartier=${quarter.id}`)
                    .then((res) => res.json())
                    .then((data) => {
                        setZones(data);
                    });
            }

            fetch(`${url}/api/data/getFinancement`)
                .then((res) => res.json())
                .then((data) => {
                    setFunList(data);
                })
                .catch(error => {
                    console.error(error);
                });

            fetch(`${url}/api/data/getTypesDeConstruction`)
                .then((res) => res.json())
                .then((data) => {
                    setConstructionList(data);
                })
                .catch(error => {
                    console.error(error);
                });

            fetch(`${url}/api/data/getStanding`)
                .then((res) => res.json())
                .then((data) => {
                    setStandingList(data);
                })
                .catch(error => {
                    console.error(error);
                });

            fetch(`${url}/api/data/getNombreDeGarages`)
                .then((res) => res.json())
                .then((data) => {
                    setGarageList(data);
                })
                .catch(error => {
                    console.error(error);
                });

            fetch(`${url}/api/data/getListDesTopologies`)
                .then((res) => res.json())
                .then((data) => {
                    setTopologieList(data);
                })
                .catch(error => {
                    console.error(error);
                });

            fetch(`${url}/api/data/getListDesTitres`)
                .then((res) => res.json())
                .then((data) => {
                    setTitleList(data);
                })
                .catch(error => {
                    console.error(error);
                });

        } catch (e) {
            console.log(e);
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
                        `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "50%",
                    overflow: "hidden",
                }}
            />
            <MDBox mb={3}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} lg={12}>
                        <Card sx={{
                            position: "relative",
                            mt: -6,
                            mx: { xs: 1, sm: 3 },
                            py: 2,
                            px: 2,
                        }}>
                            <MDBox sx={{ width: "100%" }} p={0}>
                                <Stepper activeStep={activeStep} style={{ height: 10, display: "flex" }}>
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
                                    <Grid item xs={12} lg={12} m={{ xs: 1, sm: 3 }}>
                                        <Card>
                                            <MDBox pr={1} m={{ xs: 1, sm: 3 }}>
                                                <MDTypography ml={2}>
                                                    Renseignez la localisation de votre terrain
                                                </MDTypography>
                                                <Grid container spacing={2} p={{ xs: 1, sm: 3 }}>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" } }}>
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
                                                        <FormControl required sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" } }}>
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
                                                        <FormControl required sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" } }}>
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
                                                        {isOtherQuarter &&
                                                            <MDInput
                                                                sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" }, mt: 2 }}
                                                                name="otherQuarter"
                                                                type="text"
                                                                value={otherQuarter}
                                                                label="Autre"
                                                                onChange={(e) => {
                                                                    localStorage.setItem("otherQuarter", JSON.stringify(e.target.value));
                                                                    setOtherQuarter(e.target.value);
                                                                }}
                                                            />
                                                        }
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" } }}>
                                                            <InputLabel pb={3}>Zone</InputLabel>
                                                            {zones &&
                                                                <Select sx={{ height: 44 }}
                                                                    value={zone != null ? zones?.find(x => x.id == zone?.id) : null}
                                                                    onChange={handleChangeZone}
                                                                    label="Zone *">
                                                                    {zones &&
                                                                        zones.map((item) => (
                                                                            <MenuItem key={item.id} value={item}>
                                                                                {item.zone}
                                                                            </MenuItem>
                                                                        ))}
                                                                </Select>
                                                            }
                                                        </FormControl>
                                                        {isOtherZone &&
                                                            <MDInput
                                                                sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" }, mt: 2 }}
                                                                name="otherZone"
                                                                type="text"
                                                                value={otherZone}
                                                                label="Autre"
                                                                onChange={(e) => {
                                                                    localStorage.setItem("otherZone", JSON.stringify(e.target.value));
                                                                    setOtherZone(e.target.value);
                                                                }}
                                                            />
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </MDBox>
                                        </Card>
                                    </Grid>
                                )}
                                {activeStep === 1 && (
                                    <Grid item xs={12} lg={12} m={{ xs: 1, sm: 3 }}>
                                        <Card>
                                            <MDBox pr={1} m={{ xs: 1, sm: 3 }}>
                                                <MDTypography ml={2}>
                                                    Avez-vous un titre de propri&eacute;t&eacute; sur ce terrain ?
                                                </MDTypography>
                                                <Grid container spacing={2} p={{ xs: 1, sm: 3 }}>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: "10%", mt: "8px", minWidth: "80%" }}>
                                                            <InputLabel pl={3}>Titre propri&eacute;t&eacute; </InputLabel>
                                                            <Select sx={{ height: 44 }}
                                                                value={titre}
                                                                onChange={handleChangeTitre}
                                                                label="Titre propriété *"
                                                            >
                                                                {titleList.map((title) => (
                                                                    <MenuItem key={title.id} value={title.id}>{title.Description}</MenuItem>
                                                                ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" } }}>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DemoContainer components={["DatePicker"]} sx={{ mx: "10%", minWidth: "80%" }}>
                                                                    <DatePicker
                                                                        label="Date d'obtention"
                                                                        format="DD/MM/YYYY"
                                                                        value={dayjs(date)}
                                                                        onChange={(newValue) => {
                                                                            localStorage.setItem("date", JSON.stringify(newValue.format("YYYY-MM-DD")));
                                                                            setDate(newValue.format("YYYY-MM-DD"))
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
                                    <Grid item xs={12} lg={12} m={{ xs: 1, sm: 3 }}>
                                        <Card>
                                            <MDBox pr={1} m={{ xs: 1, sm: 3 }}>
                                                <MDTypography ml={2}>
                                                    Description du terrain ?
                                                </MDTypography>
                                                <Grid container spacing={2} p={{ xs: 1, sm: 3 }}>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <MDBox sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" } }}>
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
                                                            <FormControl required sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" } }}>
                                                                <InputLabel p={3}>Topologie </InputLabel>
                                                                <Select sx={{ height: 44 }}
                                                                    value={topologie}
                                                                    onChange={handleChangeTopologie}
                                                                    label="Topologie *"
                                                                >
                                                                    {topologieList.map((topologie) => (
                                                                        <MenuItem key={topologie.id} value={topologie.Description}>{topologie.Description}</MenuItem>
                                                                    ))
                                                                    }
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
                                    <Grid item xs={12} lg={12} m={{ xs: 1, sm: 3 }}>
                                        <Card>
                                            <MDBox pr={1} m={{ xs: 1, sm: 3 }}>
                                                <MDTypography ml={2}>
                                                    Type de bien ?
                                                </MDTypography>
                                                <Grid container spacing={2} p={{ xs: 1, sm: 3 }}>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" } }}>
                                                            <InputLabel pl={3}>Type de maison </InputLabel>
                                                            <Select sx={{ height: 44 }}
                                                                value={houseType}
                                                                onChange={handleChangeTypeHouse}
                                                                label="Type de maison *"
                                                            >
                                                                {constructionList.map((construction) => (
                                                                    <MenuItem key={construction.TYP} value={construction.TYP}>{construction.LABEL}</MenuItem>
                                                                ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" } }}>
                                                            <InputLabel pb={3}>Type de standing </InputLabel>
                                                            <Select sx={{ height: 44 }}
                                                                value={standingType}
                                                                onChange={handleChangeStanding}
                                                                label="Type de standing *"
                                                            >
                                                                {standingList.map((stand) => (
                                                                    <MenuItem key={stand.STAND} value={stand.STAND}>{stand.LABEL}</MenuItem>
                                                                ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" } }}>
                                                            <InputLabel pb={3}>Garage </InputLabel>
                                                            <Select sx={{ height: 44 }}
                                                                value={nbrCars}
                                                                onChange={handleChangeCars}
                                                                label="Garage *"
                                                            >
                                                                {garageList.map((garage) => (
                                                                    <MenuItem key={garage.id} value={garage.Description}>{garage.Description}</MenuItem>
                                                                ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} xl={6}>
                                                        <FormControl required sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%" } }}>
                                                            <InputLabel pb={3}>Nombre de pi&eacute;ce </InputLabel>
                                                            <Select sx={{ height: 44 }}
                                                                value={nbrRooms}
                                                                onChange={(e) => {
                                                                    localStorage.setItem("nbrRooms", JSON.stringify(e.target.value));
                                                                    setNbrRooms(e.target.value);
                                                                }}
                                                                label="Nombre de pi&eacute;ces *"
                                                            >
                                                                {pieces.map((piece) => (
                                                                    <MenuItem key={piece.NBPCS} value={piece.NBPCS}>{piece.Description}</MenuItem>
                                                                ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </MDBox>
                                        </Card>
                                    </Grid>
                                )}
                                {activeStep === 4 && (
                                    <Grid item xs={12} lg={12} m={{ xs: 1, sm: 3 }}>
                                        <Card>
                                            <MDBox pr={1} m={{ xs: 1, sm: 3 }}>
                                                <MDTypography sx={{ mt: 2, mb: 3 }}>
                                                    Comment comptez-vous financier votre projet de construction?
                                                </MDTypography>
                                                <FormControl required sx={{ mx: { xs: 0, sm: "10%" }, minWidth: { xs: "100%", sm: "80%", md: "50%" } }}>
                                                    <InputLabel sx={{ p: 0 }}>Financement </InputLabel>
                                                    <Select sx={{ height: 44 }}
                                                        value={funding}
                                                        onChange={handleChangeFund}
                                                        label="Financement *"
                                                    >
                                                        {funList.map((fund) => (
                                                            <MenuItem key={fund.FIN} value={fund.FIN}>{fund.LABEL}</MenuItem>
                                                        ))
                                                        }
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
                {renderWarningSB}
                {/*<Fragment>*/}
                {/*    <Dialog*/}
                {/*        open={openConfirm}*/}
                {/*        aria-labelledby="responsive-dialog-title"*/}
                {/*    >*/}
                {/*        {errMessage != "" &&*/}
                {/*            <MDTypography ml={2} mt={2} color="error" fontSize={15}>*/}
                {/*                {errMessage}*/}
                {/*            </MDTypography>*/}
                {/*        }*/}
                {/*        <DialogTitle id="responsive-dialog-title">*/}
                {/*            {"Voulez-vous sauvegarder ce projet?"}*/}
                {/*        </DialogTitle>*/}
                {/*        <DialogContent>*/}
                {/*            <DialogContentText>*/}
                {/*                Si vous souhaitez enregistrer ce projet dans la liste de vos projets,*/}
                {/*                Cliquez sur &quot;Accepter&quot; sinon cliquez sur &quot;Refuser&quot;.*/}
                {/*            </DialogContentText>*/}
                {/*        </DialogContent>*/}
                {/*        <DialogActions>*/}
                {/*            <MDButton autoFocus onClick={handleCloseConfirm}>*/}
                {/*                Annuler*/}
                {/*            </MDButton>*/}
                {/*            <MDButton onClick={handleSave} autoFocus>*/}
                {/*                Enregistrer*/}
                {/*            </MDButton>*/}
                {/*        </DialogActions>*/}
                {/*    </Dialog>*/}
                {/*</Fragment>*/}
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default NewProject;
