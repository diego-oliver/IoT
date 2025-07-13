import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LiveDashboard from '../components/charts/LiveDashboard';

const LiveMonitoringPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          color="inherit" 
          href="#" 
          onClick={() => navigate('/dashboard')}
          sx={{ cursor: 'pointer' }}
        >
          Dashboard
        </Link>
        <Typography color="text.primary">Monitoreo en Vivo</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Monitoreo en Tiempo Real
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Visualización en vivo de todos los sensores y dispositivos IoT del edificio
        </Typography>
      </Box>

      {/* Live Dashboard */}
      <LiveDashboard />
    </Box>
  );
};

export default LiveMonitoringPage;