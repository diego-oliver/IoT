import React, { useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useApi } from '../../../hooks/useApi';
import { getDashboardKpis } from '../../../api/endpoints';

const EnergyWidget = () => {
  const { data: kpis, request: fetchKpis, isLoading } = useApi(getDashboardKpis);

  useEffect(() => {
    fetchKpis();
  }, []);

  const energyData = [
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

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Energy Consumption Today
      </Typography>
      
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
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        ))}
      </Box>
      
      <Box sx={{ mt: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">
          Total: {isLoading ? '...' : `${kpis?.energy_consumption_today || 0} kWh`}
        </Typography>
      </Box>
    </Box>
  );
};

export default EnergyWidget;