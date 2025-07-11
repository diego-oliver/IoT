import React, { useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Business, DeviceHub, Bolt, Warning } from '@mui/icons-material';
import { useApi } from '../../../hooks/useApi';
import { getDashboardKpis } from '../../../api/endpoints';

const KPIWidget = () => {
  const { data: kpis, request: fetchKpis, isLoading } = useApi(getDashboardKpis);

  useEffect(() => {
    fetchKpis();
  }, []);

  const kpiCards = [
    {
      title: 'Total Buildings',
      value: kpis?.total_buildings || 0,
      icon: <Business sx={{ fontSize: 32, color: 'primary.main' }} />,
      color: 'primary.main',
    },
    {
      title: 'Active Devices',
      value: kpis?.active_devices || 0,
      icon: <DeviceHub sx={{ fontSize: 32, color: 'success.main' }} />,
      color: 'success.main',
    },
    {
      title: 'Energy Today (kWh)',
      value: kpis?.energy_consumption_today || 0,
      icon: <Bolt sx={{ fontSize: 32, color: 'warning.main' }} />,
      color: 'warning.main',
    },
    {
      title: 'Active Alarms',
      value: kpis?.active_alarms || 0,
      icon: <Warning sx={{ fontSize: 32, color: 'error.main' }} />,
      color: 'error.main',
    },
  ];

  return (
    <Grid container spacing={2} sx={{ height: '100%' }}>
      {kpiCards.map((kpi, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <CardContent sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    {kpi.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: kpi.color }}>
                    {isLoading ? '...' : kpi.value}
                  </Typography>
                </Box>
                {kpi.icon}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default KPIWidget;