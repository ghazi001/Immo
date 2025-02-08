import { useState, useContext } from "react";
import { AuthContext } from "context/authContext";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
  const { login,waitnigToSignIn, setIsLogIn, setWaitingToSignIn } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const handleLogin = async (e) => {
    e.preventDefault();
      try {
        await login(inputs);
        if (waitnigToSignIn) {
            setIsLogIn(true)
            setWaitingToSignIn(false)
            navigate("/nouveau-Projet");
        }
        else {
            navigate("/");
        }
    } catch (err) {
      setErr(err.response.data);
    }
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="email" label="Username" name="username" fullWidth onChange={handleChange} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Password" name="password" fullWidth onChange={handleChange} />
            </MDBox>
            {err && <MDTypography variant="h6" fontWeight="regular" color="error">{err}</MDTypography>}
            <MDBox mt={3} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleLogin}>
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
