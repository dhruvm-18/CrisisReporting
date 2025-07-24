import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ReportFormPage from './pages/ReportFormPage';
import LiveMapPage from './pages/LiveMapPage';
import DonatePage from './pages/DonatePage';
import ResourcesPage from './pages/ResourcesPage';
import { AppBar, Toolbar, Typography, Button, Box, Stack } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function NavBar() {
  const navigate = useNavigate();
  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
          <ShieldIcon color="primary" />
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 700 }}>
            CrisisReport
          </Typography>
        </Stack>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/reports">Reports</Button>
        <Button color="inherit" component={Link} to="/live-map">Live Feed</Button>
        <Button color="inherit" component={Link} to="/donate">Donate</Button>
        <Button color="inherit" component={Link} to="/resources">Resources</Button>
        <Button variant="contained" color="error" sx={{ ml: 2, fontWeight: 700 }} onClick={() => navigate('/reports')}>
          Report Emergency
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar />
        <Box sx={{ minHeight: '100vh', bgcolor: '#fafbfc' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reports" element={<ReportFormPage />} />
            <Route path="/live-map" element={<LiveMapPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
