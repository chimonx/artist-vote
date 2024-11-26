import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send login data to the server
      const response = await axios.post(
        "https://login.smobu.cloud/artist/react.php",
        { username: username.trim(), password: password.trim() },
        { withCredentials: true }
      );

      const data = response.data;

      if (data.status === "studentOK") {
        localStorage.setItem("authStatus", "student");
        onLoginSuccess("student");
        navigate("/");
      } else if (data.status === "facultyOK") {
        localStorage.setItem("authStatus", "faculty");
        onLoginSuccess("faculty");
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "5rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Login by BU Account
        </Typography>
        {error && (
          <Alert severity="error" style={{ marginBottom: "1rem" }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <Box textAlign="center" marginTop="2rem">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              style={{ minWidth: "150px" }}
            >
              {loading ? "Logging In..." : "Login"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
