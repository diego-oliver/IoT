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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add, Settings } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useApi } from '../hooks/useApi';
import {
  getRoom,
  getRoomDevices,
  getRoomConsumption,
  simulateRoom,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceTypes,
} from '../api/endpoints';
import ChartWrapper from '../components/common/ChartWrapper';
import ErrorDisplay from '../components/common/ErrorDisplay';
import LoadingOverlay from '../components/common/LoadingOverlay';

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [deviceDialog, setDeviceDialog] = useState({ open: false, device: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, deviceId: null });

  const { data: room, request: fetchRoom, isLoading: roomLoading, error: roomError } = useApi(getRoom);
  const { data: devices, request: fetchDevices, isLoading: devicesLoading } = useApi(getRoomDevices);
  const { data: consumption, request: fetchConsumption, isLoading: consumptionLoading } = useApi(getRoomConsumption);
  const { data: deviceTypes, request: fetchDeviceTypes } = useApi(getDeviceTypes);
  const { request: toggleSimulation } = useApi(simulateRoom);
  const { request: createDeviceRequest } = useApi(createDevice);
  const { request: updateDeviceRequest } = useApi(updateDevice);
  const { request: deleteDeviceRequest } = useApi(deleteDevice);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  useEffect(() => {
    loadRoomData();
    fetchDeviceTypes();
  }, [roomId]);

  const loadRoomData = async () => {
    try {
      await Promise.all([
        fetchRoom(roomId),
        fetchDevices(roomId),
        fetchConsumption(roomId),
      ]);
    } catch (error) {
      console.error('Failed to load room data:', error);
    }
  };

  const handleSimulationToggle = async (event) => {
    try {
      await toggleSimulation(roomId, event.target.checked);
      await fetchRoom(roomId);
    } catch (error) {
      console.error('Failed to toggle simulation:', error);
    }
  };

  const handleDeviceSubmit = async (data) => {
    try {
      const deviceData = {
        ...data,
        state: data.state ? JSON.parse(data.state) : {},
      };

      if (deviceDialog.device) {
        await updateDeviceRequest(deviceDialog.device.id, deviceData);
      } else {
        await createDeviceRequest(roomId, deviceData);
      }
      setDeviceDialog({ open: false, device: null });
      reset();
      await fetchDevices(roomId);
    } catch (error) {
      console.error('Failed to save device:', error);
    }
  };

  const handleDeleteDevice = async () => {
    try {
      await deleteDeviceRequest(deleteDialog.deviceId);
      setDeleteDialog({ open: false, deviceId: null });
      await fetchDevices(roomId);
    } catch (error) {
      console.error('Failed to delete device:', error);
    }
  };

  const openDeviceDialog = (device = null) => {
    setDeviceDialog({ open: true, device });
    if (device) {
      reset({
        ...device,
        state: JSON.stringify(device.state, null, 2),
      });
    } else {
      reset({
        name: '',
        device_type_id: '',
        state: '{}',
        is_active: true,
      });
    }
  };

  const consumptionChartOption = {
    title: {
      text: 'Room Energy Consumption',
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

  const deviceColumns = [
    {
      field: 'name',
      headerName: 'Device Name',
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
          onClick={() => navigate(`/devices/${params.row.id}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'device_type_id',
      headerName: 'Type',
      width: 150,
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 100,
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
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => navigate(`/devices/${params.row.id}`)}>
            <Settings />
          </IconButton>
          <IconButton size="small" onClick={() => openDeviceDialog(params.row)}>
            <Edit />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => setDeleteDialog({ open: true, deviceId: params.row.id })}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (roomError) {
    return <ErrorDisplay error={roomError} onRetry={loadRoomData} />;
  }

  if (roomLoading || !room) {
    return <LoadingOverlay message="Loading room details..." />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {room.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Floor ID: {room.floor_id}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={room.is_simulating}
                onChange={handleSimulationToggle}
              />
            }
            label="Simulation Active"
          />
          <Button variant="outlined" onClick={() => navigate(`/floors/${room.floor_id}`)}>
            Back to Floor
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab label="Overview" />
          <Tab label="Device Management" />
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
                  Room Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Room Name
                    </Typography>
                    <Typography variant="h6">
                      {room.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Total Devices
                    </Typography>
                    <Typography variant="h6">
                      {devices?.length || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Active Devices
                    </Typography>
                    <Typography variant="h6">
                      {devices?.filter(d => d.is_active).length || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Simulation Status
                    </Typography>
                    <Chip
                      label={room.is_simulating ? 'Active' : 'Inactive'}
                      color={room.is_simulating ? 'success' : 'default'}
                    />
                  </Box>
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
                Device Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => openDeviceDialog()}
              >
                Add Device
              </Button>
            </Box>
            
            <Box sx={{ height: 400, width: '100%', position: 'relative' }}>
              {devicesLoading && <LoadingOverlay />}
              <DataGrid
                rows={devices || []}
                columns={deviceColumns}
                pageSize={10}
                rowsPerPageOptions={[10, 25]}
                disableSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Device Dialog */}
      <Dialog open={deviceDialog.open} onClose={() => setDeviceDialog({ open: false, device: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          {deviceDialog.device ? 'Edit Device' : 'Create Device'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Device Name"
                fullWidth
                variant="outlined"
                {...register('name', { required: 'Device name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Device Type</InputLabel>
                <Select
                  {...register('device_type_id', { required: 'Device type is required' })}
                  error={!!errors.device_type_id}
                  value={watch('device_type_id') || ''}
                >
                  {deviceTypes?.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.type_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Initial State (JSON)"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                {...register('state')}
                helperText="Enter device state as JSON object"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('is_active')}
                    checked={watch('is_active')}
                  />
                }
                label="Device Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeviceDialog({ open: false, device: null })}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleDeviceSubmit)} variant="contained">
            {deviceDialog.device ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, deviceId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this device? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, deviceId: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteDevice} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomDetailsPage;