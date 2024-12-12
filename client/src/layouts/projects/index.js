import { Fragment, useState, useEffect, useContext } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
// Images
import duplexImg from "assets/images/duplex.png";
import houseImg from "assets/images/house.png";
import triplexImg from "assets/images/triplex.png";

import { Card } from "@mui/material";
import { AuthContext } from "context/authContext";
import { useNavigate } from "react-router-dom";


function Projects() {
    const { currentUser, url} = useContext(AuthContext);
    const [projects, setProjects] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser)
            navigate("/nouveau-projet")
        else
        fetch(`${url}/api/projects/list?userId=${currentUser.id}`)
            .then((res) => res.json())
            .then((data) => {
                setProjects(data);
            });
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mb={3}>
                <Card>
                    <MDBox py={2}>
                        <Grid container spacing={6} p={3}>
                            {projects &&
                                projects.map((project) => (
                                    <Grid item xs={12} md={6} xl={3} key={project.id}>
                                        <DefaultProjectCard
                                            image={project.typeMaison == "Triplex" ? triplexImg : project.typeMaison == "Duplex" ? duplexImg : houseImg}
                                            label={project.typeStanding}
                                            project={project}
                                            title={parseFloat(project.surface)+"m\u00b2, "+ project.ville }
                                            description={project.commune + ", " + project.zone+", "+project.quartier}
                                            action={{
                                                type: "internal",
                                                route: "/nouveau-Projet",
                                                color: "info",
                                                label: "view project",
                                            }}
                                        />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </MDBox>
                </Card>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Projects;
