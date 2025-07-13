import React, { useEffect, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useApi } from '../hooks/useApi';
import {
  getBuilding,
  getBuildingLiveData,
  getBuildingConsumption,
  getBuildingFloors,
  simulateBuilding,
  createFloor,
  updateFloor,
  deleteFloor,
  simulateFloor,
} from '../api/endpoints';
import ChartWrapper from '../components/common/ChartWrapper';
import ExportButton from '../components/common/ExportButton';
import ErrorDisplay from '../components/common/ErrorDisplay';
import LoadingOverlay from '../components/common/LoadingOverlay';
import ResponsiveDataGrid from '../components/common/ResponsiveDataGrid';
import { DashboardSkeleton } from '../components/common/LoadingSkeleton';

const BuildingDetailsPage = () => {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [liveDataInterval, setLiveDataInterval] = useState(null);
  const [floorDialog, setFloorDialog] = useState({ open: false, floor: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, floorId: null });

  const { data: building, request: fetchBuilding, isLoading: buildingLoading, error: buildingError } = useApi(getBuilding);
  const { data: liveData, request: fetchLiveData, isLoading: liveDataLoading } = useApi(getBuildingLiveData);
  const { data: consumption, request: fetchConsumption, isLoading: consumptionLoading } = useApi(getBuildingConsumption);
  const { data: floors, request: fetchFloors, isLoading: floorsLoading } = useApi(getBuildingFloors);
  const { request: toggleSimulation } = useApi(simulateBuilding);
  const { request: createFloorRequest } = useApi(createFloor);
  const { request: updateFloorRequest } = useApi(updateFloor);
  const { request: deleteFloorRequest } = useApi(deleteFloor);
  const { request: toggleFloorSimulation } = useApi(simulateFloor);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadBuildingData();
    return () => {
      if (liveDataInterval) {
        clearInterval(liveDataInterval);
      }
    };
  }, [buildingId]);

  useEffect(() => {
    if (currentTab === 0) {
      // Start live data polling when on summary tab
      const interval = setInterval(() => {
        fetchLiveData(buildingId);
      }, 5000);
      setLiveDataInterval(interval);
      
      return () => clearInterval(interval);
    } else {
      // Clear interval when not on summary tab
      if (liveDataInterval) {
        clearInterval(liveDataInterval);
        setLiveDataInterval(null);
      }
    }
  }, [currentTab, buildingId]);

  const loadBuildingData = async () => {
    try {
      await Promise.all([
        fetchBuilding(buildingId),
        fetchLiveData(buildingId),
        fetchConsumption(buildingId),
        fetchFloors(buildingId),
      ]);
    } catch (error) {
      console.error('Failed to load building data:', error);
    }
  };

  const handleSimulationToggle = async (event) => {
    try {
      await toggleSimulation(buildingId, event.target.checked);
      await fetchBuilding(buildingId); // Refresh building data
    } catch (error) {
      console.error('Failed to toggle simulation:', error);
    }
  };

  const handleFloorSubmit = async (data) => {
    try {
      if (floorDialog.floor) {
        await updateFloorRequest(floorDialog.floor.id, data);
      } else {
        await createFloorRequest(buildingId, data);
      }
      setFloorDialog({ open: false, floor: null });
      reset();
      await fetchFloors(buildingId);
    } catch (error) {
      console.error('Failed to save floor:', error);
    }
  };

  const handleDeleteFloor = async () => {
    try {
      await deleteFloorRequest(deleteDialog.floorId);
      setDeleteDialog({ open: false, floorId: null });
      await fetchFloors(buildingId);
    } catch (error) {
      console.error('Failed to delete floor:', error);
    }
  };

  const handleFloorSimulationToggle = async (floorId, status) => {
    try {
      await toggleFloorSimulation(floorId, status);
      await fetchFloors(buildingId);
    } catch (error) {
      console.error('Failed to toggle floor simulation:', error);
    }
  };

  const openFloorDialog = (floor = null) => {
    setFloorDialog({ open: true, floor });
    if (floor) {
      reset(floor);
    } else {
      reset({ floor_number: '', plan_url: '' });
    }
  };

  const consumptionChartOption = {
    title: {
      text: 'Energy Consumption by Type',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} kWh ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Consumption',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        data: consumption ? Object.entries(consumption).map(([key, value]) => ({
          value,
          name: key.replace('_', ' ').toUpperCase(),
        })) : [],
      },
    ],
  };

  const floorColumns = [
    {
      field: 'floor_number',
      headerName: 'Floor',
      width: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
          onClick={() => navigate(`/floors/${params.row.id}`)}
        >
          Floor {params.value}
        </Typography>
      ),
    },
    {
      field: 'is_simulating',
      headerName: 'Simulation',
      width: 120,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={(e) => handleFloorSimulationToggle(params.row.id, e.target.checked)}
          size="small"
        />
      ),
    },
    {
      field: 'plan_url',
      headerName: 'Floor Plan',
      flex: 1,
      renderCell: (params) => (
        params.value ? (
          <Button size="small" href={params.value} target="_blank">
            View Plan
          </Button>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No plan available
          </Typography>
        )
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => openFloorDialog(params.row)}>
            <Edit />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => setDeleteDialog({ open: true, floorId: params.row.id })}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (buildingError) {
    return <ErrorDisplay error={buildingError} onRetry={loadBuildingData} />;
  }

  if (buildingLoading || !building) {
    return <DashboardSkeleton />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {building.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {building.address}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={building.is_simulating}
                onChange={handleSimulationToggle}
              />
            }
            label="Simulation Active"
          />
          <Button variant="outlined">
            Edit Building
          </Button>
          <ExportButton
            data={building ? [building] : []}
            filename={`building-${building?.name?.replace(/\s+/g, '-').toLowerCase()}`}
            title={`Building Report: ${building?.name}`}
            buttonText="Export Report"
          />
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab label="Summary & Live Data" />
          <Tab label="Historical Analysis" />
          <Tab label="Floor Management" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          {/* Consumption Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <ChartWrapper
                  option={consumptionChartOption}
                  isLoading={consumptionLoading}
                  height={300}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Live Data */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Live Data
                  </Typography>
                  <Chip
                    label={liveDataLoading ? 'Updating...' : 'Live'}
                    color={liveDataLoading ? 'default' : 'success'}
                    size="small"
                  />
                </Box>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="right">Timestamp</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {liveData?.slice(0, 10).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.sensor_type || 'Unknown'}</TableCell>
                          <TableCell align="right">
                            {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
                          </TableCell>
                          <TableCell align="right">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {currentTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Historical Analysis
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Historical data analysis features will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {currentTab === 2 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Floor Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => openFloorDialog()}
              >
                Add Floor
              </Button>
            </Box>
            
            <ResponsiveDataGrid
                rows={floors || []}
                columns={floorColumns}
                loading={floorsLoading}
                title="Pisos del Edificio"
                mobileCardRenderer={(row, isExpanded, onToggle) => (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        Piso {row.floor_number}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Switch
                          checked={row.is_simulating}
                          onChange={(e) => handleFloorSimulationToggle(row.id, e.target.checked)}
                          size="small"
                        />
                        <IconButton size="small" onClick={() => openFloorDialog(row)}>
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => setDeleteDialog({ open: true, floorId: row.id })}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Creado: {new Date(row.created_at).toLocaleDateString()}
                    </Typography>
                    {row.plan_url && (
                      <Button size="small" href={row.plan_url} target="_blank" sx={{ mt: 1 }}>
                        Ver Plano
                      </Button>
                    )}
                  </Box>
                )}
            />
          </CardContent>
        </Card>
      )}

      {/* Floor Dialog */}
      <Dialog open={floorDialog.open} onClose={() => setFloorDialog({ open: false, floor: null })}>
        <DialogTitle>
          {floorDialog.floor ? 'Edit Floor' : 'Create Floor'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Floor Number"
            type="number"
            fullWidth
            variant="outlined"
            {...register('floor_number', { required: 'Floor number is required' })}
            error={!!errors.floor_number}
            helperText={errors.floor_number?.message}
          />
          <TextField
            margin="dense"
            label="Floor Plan URL"
            fullWidth
            variant="outlined"
            {...register('plan_url')}
            helperText="Optional URL to floor plan image"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFloorDialog({ open: false, floor: null })}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleFloorSubmit)} variant="contained">
            {floorDialog.floor ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, floorId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this floor? This action cannot be undone and will also delete all rooms and devices on this floor.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, floorId: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteFloor} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BuildingDetailsPage;