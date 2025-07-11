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
  getFloor,
  getFloorRooms,
  getFloorConsumption,
  simulateFloor,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../api/endpoints';
import ChartWrapper from '../components/common/ChartWrapper';
import ErrorDisplay from '../components/common/ErrorDisplay';
import LoadingOverlay from '../components/common/LoadingOverlay';

const FloorDetailsPage = () => {
  const { floorId } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [roomDialog, setRoomDialog] = useState({ open: false, room: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, roomId: null });

  const { data: floor, request: fetchFloor, isLoading: floorLoading, error: floorError } = useApi(getFloor);
  const { data: rooms, request: fetchRooms, isLoading: roomsLoading } = useApi(getFloorRooms);
  const { data: consumption, request: fetchConsumption, isLoading: consumptionLoading } = useApi(getFloorConsumption);
  const { request: toggleSimulation } = useApi(simulateFloor);
  const { request: createRoomRequest } = useApi(createRoom);
  const { request: updateRoomRequest } = useApi(updateRoom);
  const { request: deleteRoomRequest } = useApi(deleteRoom);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    loadFloorData();
  }, [floorId]);

  const loadFloorData = async () => {
    try {
      await Promise.all([
        fetchFloor(floorId),
        fetchRooms(floorId),
        fetchConsumption(floorId),
      ]);
    } catch (error) {
      console.error('Failed to load floor data:', error);
    }
  };

  const handleSimulationToggle = async (event) => {
    try {
      await toggleSimulation(floorId, event.target.checked);
      await fetchFloor(floorId);
    } catch (error) {
      console.error('Failed to toggle simulation:', error);
    }
  };

  const handleRoomSubmit = async (data) => {
    try {
      if (roomDialog.room) {
        await updateRoomRequest(roomDialog.room.id, data);
      } else {
        await createRoomRequest(floorId, data);
      }
      setRoomDialog({ open: false, room: null });
      reset();
      await fetchRooms(floorId);
    } catch (error) {
      console.error('Failed to save room:', error);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteRoomRequest(deleteDialog.roomId);
      setDeleteDialog({ open: false, roomId: null });
      await fetchRooms(floorId);
    } catch (error) {
      console.error('Failed to delete room:', error);
    }
  };

  const openRoomDialog = (room = null) => {
    setRoomDialog({ open: true, room });
    if (room) {
      reset(room);
    } else {
      reset({ name: '' });
    }
  };

  const consumptionChartOption = {
    title: {
      text: 'Floor Energy Consumption',
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
        data: consumption ? Object.entries(consumption).map(([key, value]) => ({
          value,
          name: key.replace('_', ' ').toUpperCase(),
        })) : [],
      },
    ],
  };

  const roomColumns = [
    {
      field: 'name',
      headerName: 'Room Name',
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
          onClick={() => navigate(`/rooms/${params.row.id}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'is_simulating',
      headerName: 'Simulation',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
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
          <IconButton size="small" onClick={() => openRoomDialog(params.row)}>
            <Edit />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => setDeleteDialog({ open: true, roomId: params.row.id })}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (floorError) {
    return <ErrorDisplay error={floorError} onRetry={loadFloorData} />;
  }

  if (floorLoading || !floor) {
    return <LoadingOverlay message="Loading floor details..." />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Floor {floor.floor_number}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Building ID: {floor.building_id}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={floor.is_simulating}
                onChange={handleSimulationToggle}
              />
            }
            label="Simulation Active"
          />
          <Button variant="outlined" onClick={() => navigate(`/buildings/${floor.building_id}`)}>
            Back to Building
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab label="Overview" />
          <Tab label="Room Management" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
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
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Floor Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Floor Number
                    </Typography>
                    <Typography variant="h6">
                      {floor.floor_number}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Total Rooms
                    </Typography>
                    <Typography variant="h6">
                      {rooms?.length || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Simulation Status
                    </Typography>
                    <Chip
                      label={floor.is_simulating ? 'Active' : 'Inactive'}
                      color={floor.is_simulating ? 'success' : 'default'}
                    />
                  </Box>
                  {floor.plan_url && (
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Floor Plan
                      </Typography>
                      <Button href={floor.plan_url} target="_blank">
                        View Plan
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {currentTab === 1 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Room Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => openRoomDialog()}
              >
                Add Room
              </Button>
            </Box>
            
            <Box sx={{ height: 400, width: '100%', position: 'relative' }}>
              {roomsLoading && <LoadingOverlay />}
              <DataGrid
                rows={rooms || []}
                columns={roomColumns}
                pageSize={10}
                rowsPerPageOptions={[10, 25]}
                disableSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Room Dialog */}
      <Dialog open={roomDialog.open} onClose={() => setRoomDialog({ open: false, room: null })}>
        <DialogTitle>
          {roomDialog.room ? 'Edit Room' : 'Create Room'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            fullWidth
            variant="outlined"
            {...register('name', { required: 'Room name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoomDialog({ open: false, room: null })}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleRoomSubmit)} variant="contained">
            {roomDialog.room ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, roomId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this room? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, roomId: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteRoom} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FloorDetailsPage;