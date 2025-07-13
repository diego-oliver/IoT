import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import {
  Business,
  DeviceHub,
  Bolt,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState({
    total_buildings: 5,
    active_devices: 42,
    energy_consumption_today: 1250,
    active_alarms: 3
  });

  const kpiCards = [
    {
      title: 'Total Buildings',
      value: kpis.total_buildings,
      icon: <Business sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.main',
      onClick: () => navigate('/buildings')
    },
    {
      title: 'Active Devices',
      value: kpis.active_devices,
      icon: <DeviceHub sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.main',
      onClick: () => navigate('/live-monitoring')
    },
    {
      title: 'Energy Today (kWh)',
      value: kpis.energy_consumption_today,
      icon: <Bolt sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning.main',
      onClick: () => navigate('/live-monitoring')
    },
    {
      title: 'Active Alarms',
      value: kpis.active_alarms,
      icon: <Warning sx={{ fontSize: 40, color: 'error.main' }} />,
      color: 'error.main',
      onClick: () => navigate('/alarms')
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        IoT Building Management Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Bienvenido al sistema de gestión inteligente de edificios
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiCards.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={kpi.onClick}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {kpi.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: kpi.color }}>
                      {kpi.value}
                    </Typography>
                  </Box>
                  {kpi.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sistema de Monitoreo en Tiempo Real
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              Plataforma completa para la gestión de edificios inteligentes con capacidades IoT.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              <Chip 
                label="Simulación Activa" 
                color="success" 
                clickable
                onClick={() => navigate('/live-monitoring')}
              />
              <Chip 
                label="Datos en Vivo" 
                color="primary" 
                clickable
                onClick={() => navigate('/live-monitoring')}
              />
              <Chip 
                label="Alertas Configuradas" 
                color="warning" 
                clickable
                onClick={() => navigate('/alarms')}
              />
            </Box>

            <Button 
              variant="contained" 
              onClick={() => navigate('/live-monitoring')}
              sx={{ mr: 2 }}
            >
              Ver Monitoreo en Vivo
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/buildings')}
            >
              Gestionar Edificios
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Acciones Rápidas
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/buildings')}
              >
                Ver Edificios
              </Button>
              <Button 
                variant="outlined" 
                fullWidth
                onClick={() => navigate('/alarms')}
              >
                Gestionar Alarmas
              </Button>
              <Button 
                variant="outlined" 
                fullWidth
                onClick={() => navigate('/settings')}
              >
                Configuración
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;