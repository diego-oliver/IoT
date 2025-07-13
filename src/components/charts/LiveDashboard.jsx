import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Switch, 
  FormControlLabel,
  Chip,
  Alert
} from '@mui/material';
import RealtimeChart from './RealtimeChart';
import MultiDeviceChart from './MultiDeviceChart';

const LiveDashboard = ({ buildingId }) => {
  const [isLiveMode, setIsLiveMode] = useState(true);

  // Datos simulados de dispositivos
  const mockDevices = [
    { id: 'temp_001', name: 'Sensor Temperatura Sala A', type: 'temperature_sensor' },
    { id: 'hum_001', name: 'Sensor Humedad Sala A', type: 'humidity_sensor' },
    { id: 'energy_001', name: 'Medidor Energía Principal', type: 'energy_meter' },
    { id: 'hvac_001', name: 'Sistema HVAC Piso 1', type: 'hvac_system' },
    { id: 'light_001', name: 'Sistema Iluminación', type: 'lighting_system' },
    { id: 'air_001', name: 'Calidad del Aire', type: 'air_quality' }
  ];

  return (
    <Box>
      {/* Control Principal */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Dashboard en Tiempo Real
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isLiveMode}
                onChange={(e) => setIsLiveMode(e.target.checked)}
                color="success"
              />
            }
            label="Modo en Vivo"
          />
          <Chip
            label={isLiveMode ? 'LIVE' : 'PAUSADO'}
            color={isLiveMode ? 'success' : 'default'}
            variant="filled"
          />
        </Box>
      </Box>

      {/* Alerta de Simulación */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Modo Simulación:</strong> Los datos mostrados son simulados para demostrar 
          el comportamiento en tiempo real. En producción, estos datos vendrían de sensores IoT reales.
        </Typography>
      </Alert>

      {/* Gráficos Individuales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <RealtimeChart
            title="Temperatura Ambiente"
            deviceType="temperature"
            color="#ff6b35"
            unit="°C"
            height={250}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RealtimeChart
            title="Humedad Relativa"
            deviceType="humidity"
            color="#4ecdc4"
            unit="%"
            height={250}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RealtimeChart
            title="Consumo Energético"
            deviceType="energy"
            color="#45b7d1"
            unit="kWh"
            height={250}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RealtimeChart
            title="Presión Atmosférica"
            deviceType="pressure"
            color="#96ceb4"
            unit="hPa"
            height={250}
          />
        </Grid>
      </Grid>

      {/* Gráfico Multi-Dispositivo */}
      <Card>
        <CardContent>
          <MultiDeviceChart 
            devices={mockDevices}
            height={400}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default LiveDashboard;