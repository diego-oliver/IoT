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
  IconButton,
} from '@mui/material';
import {
  Business,
  DeviceHub,
  Bolt,
  Warning,
  PlayArrow,
  Stop,
  Refresh,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import {
  getDashboardKpis,
  getBuildings,
  getSimulationStatus,
  startGlobalSimulation,
  stopGlobalSimulation,
} from '../api/endpoints';
import ChartWrapper from '../components/common/ChartWrapper';
import ErrorDisplay from '../components/common/ErrorDisplay';
import LoadingOverlay from '../components/common/LoadingOverlay';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [globalSimStatus, setGlobalSimStatus] = useState(null);
  const [isSimulationLoading, setIsSimulationLoading] = useState(false);

  const { data: kpis, request: fetchKpis, isLoading: kpisLoading, error: kpisError } = useApi(getDashboardKpis);
  const { data: buildings, request: fetchBuildings, isLoading: buildingsLoading, error: buildingsError } = useApi(getBuildings);
  const { request: fetchSimStatus } = useApi(getSimulationStatus);
  const { request: startSim } = useApi(startGlobalSimulation);
  const { request: stopSim } = useApi(stopGlobalSimulation);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadSimulationStatus, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchKpis(),
        fetchBuildings({ skip: 0, limit: 100 }),
        loadSimulationStatus(),
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const loadSimulationStatus = async () => {
    try {
      const status = await fetchSimStatus();
      setGlobalSimStatus(status);
    } catch (error) {
      console.error('Failed to load simulation status:', error);
    }
  };

  const handleSimulationToggle = async (action) => {
    try {
      setIsSimulationLoading(true);
      if (action === 'start') {
        await startSim();
      } else {
        await stopSim();
      }
      await loadSimulationStatus();
    } catch (error) {
      console.error('Simulation control failed:', error);
    } finally {
      setIsSimulationLoading(false);
    }
  };

  const kpiCards = [
    {
      title: 'Total Buildings',
      value: kpis?.total_buildings || 0,
      icon: <Business sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.main',
    },
    {
      title: 'Active Devices',
      value: kpis?.active_devices || 0,
      icon: <DeviceHub sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.main',
    },
    {
      title: 'Energy Today (kWh)',
      value: kpis?.energy_consumption_today || 0,
      icon: <Bolt sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning.main',
    },
    {
      title: 'Active Alarms',
      value: kpis?.active_alarms || 0,
      icon: <Warning sx={{ fontSize: 40, color: 'error.main' }} />,
      color: 'error.main',
    },
  ];

  const buildingColumns = [
    {
      field: 'name',
      headerName: 'Building Name',
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
          onClick={() => navigate(`/buildings/${params.row.id}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
    },
    {
      field: 'is_simulating',
      headerName: 'Simulation Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
  ];

  const chartOption = {
    title: {
      text: 'Building Performance Overview',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Buildings',
        type: 'pie',
        radius: '50%',
        data: [
          { value: kpis?.total_buildings - (kpis?.active_devices || 0), name: 'Inactive Buildings' },
          { value: kpis?.active_devices || 0, name: 'Active Buildings' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  if (kpisError || buildingsError) {
    return (
      <ErrorDisplay
        error={kpisError || buildingsError}
        onRetry={loadData}
        title="Failed to Load Dashboard"
      />
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiCards.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {kpi.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: kpi.color }}>
                      {kpisLoading ? '...' : kpi.value}
                    </Typography>
                  </Box>
                  {kpi.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Global Simulation Controls */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Global Simulation Control
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={globalSimStatus?.is_active ? 'Active' : 'Inactive'}
                  color={globalSimStatus?.is_active ? 'success' : 'default'}
                  sx={{ mb: 2 }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PlayArrow />}
                  onClick={() => handleSimulationToggle('start')}
                  disabled={isSimulationLoading || globalSimStatus?.is_active}
                  size="small"
                >
                  Start Global
                </Button>
                
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Stop />}
                  onClick={() => handleSimulationToggle('stop')}
                  disabled={isSimulationLoading || !globalSimStatus?.is_active}
                  size="small"
                >
                  Stop Global
                </Button>
                
                <IconButton
                  onClick={loadSimulationStatus}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <Refresh />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <ChartWrapper
                option={chartOption}
                isLoading={kpisLoading}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Buildings Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Buildings Overview
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/buildings/new')}
              >
                Add Building
              </Button>
            </Box>
            
            <Box sx={{ height: 400, width: '100%', position: 'relative' }}>
              {buildingsLoading && <LoadingOverlay />}
              <DataGrid
                rows={buildings || []}
                columns={buildingColumns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-cell:hover': {
                    color: 'primary.main',
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;