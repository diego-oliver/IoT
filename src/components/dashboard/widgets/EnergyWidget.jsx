import React, { useEffect } from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import { useApi } from '../../../hooks/useApi';
import { useRealtimeData } from '../../../hooks/useRealtimeData';
import { getDashboardKpis } from '../../../api/endpoints';

const EnergyWidget = () => {
  const { data: kpis, request: fetchKpis, isLoading } = useApi(getDashboardKpis);
  
  // Simulación de datos en tiempo real para consumo energético
  const { data: liveEnergyData } = useRealtimeData([], {
    interval: 4000,
    maxDataPoints: 1,
    dataGenerator: () => {
      const baseConsumption = kpis?.energy_consumption_today || 500;
      return {
        timestamp: new Date().toISOString(),
        hvac: baseConsumption * 0.4 + Math.random() * 50,
        lighting: baseConsumption * 0.3 + Math.random() * 30,
        equipment: baseConsumption * 0.2 + Math.random() * 20,
        other: baseConsumption * 0.1 + Math.random() * 10
      };
    }
  });

  useEffect(() => {
    fetchKpis();
  }, []);

  const getCurrentEnergyData = () => {
    const currentLive = liveEnergyData.length > 0 ? liveEnergyData[liveEnergyData.length - 1] : null;
    
    if (currentLive) {
      return [
        {
          label: 'Sistemas HVAC',
          value: currentLive.hvac,
          max: 1000,
          color: 'primary',
        },
        {
          label: 'Iluminación',
          value: currentLive.lighting,
          max: 800,
          color: 'secondary',
        },
        {
          label: 'Equipamiento',
          value: currentLive.equipment,
          max: 600,
          color: 'warning',
        },
        {
          label: 'Otros',
          value: currentLive.other,
          max: 400,
          color: 'info',
        },
      ];
    }
    
    // Datos estáticos de respaldo
    return [
    {
      label: 'HVAC Systems',
      value: kpis?.energy_consumption_today * 0.4 || 0,
      max: 1000,
      color: 'primary',
    },
    {
      label: 'Lighting',
      value: kpis?.energy_consumption_today * 0.3 || 0,
      max: 800,
      color: 'secondary',
    },
    {
      label: 'Equipment',
      value: kpis?.energy_consumption_today * 0.2 || 0,
      max: 600,
      color: 'warning',
    },
    {
      label: 'Other',
      value: kpis?.energy_consumption_today * 0.1 || 0,
      max: 400,
      color: 'info',
    },
    ];
  };
  
  const energyData = getCurrentEnergyData();

  return (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Consumo Energético Hoy
        </Typography>
        <Chip
          label="LIVE"
          color="success"
          size="small"
          variant="filled"
        />
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {energyData.map((item, index) => (
          <Box key={index}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">{item.label}</Typography>
              <Typography variant="body2" color="textSecondary">
                {isLoading ? '...' : `${item.value.toFixed(1)} kWh`}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(item.value / item.max) * 100}
              color={item.color}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  transition: 'transform 0.8s ease'
                }
              }}
            />
          </Box>
        ))}
      </Box>
      
      <Box sx={{ mt: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">
          Total: {isLoading ? '...' : `${energyData.reduce((sum, item) => sum + item.value, 0).toFixed(1)} kWh`}
        </Typography>
        <Typography variant="caption" color="success.main">
          ● Actualizándose en tiempo real
        </Typography>
      </Box>
    </Box>
  );
};

export default EnergyWidget;