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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add, PlayArrow, Schedule } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useApi } from '../hooks/useApi';
import {
  getDevice,
  updateDevice,
  executeDeviceAction,
  getDeviceSchedules,
  createDeviceSchedule,
  updateDeviceSchedule,
  deleteDeviceSchedule,
  getDeviceTelemetry,
  getDeviceConsumption,
} from '../api/endpoints';
import ChartWrapper from '../components/common/ChartWrapper';
import ErrorDisplay from '../components/common/ErrorDisplay';
import LoadingOverlay from '../components/common/LoadingOverlay';

const DeviceDetailsPage = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [actionDialog, setActionDialog] = useState({ open: false });
  const [scheduleDialog, setScheduleDialog] = useState({ open: false, schedule: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, scheduleId: null });
  const [actionError, setActionError] = useState('');

  const { data: device, request: fetchDevice, isLoading: deviceLoading, error: deviceError } = useApi(getDevice);
  const { data: schedules, request: fetchSchedules, isLoading: schedulesLoading } = useApi(getDeviceSchedules);
  const { data: telemetry, request: fetchTelemetry, isLoading: telemetryLoading } = useApi(getDeviceTelemetry);
  const { data: consumption, request: fetchConsumption, isLoading: consumptionLoading } = useApi(getDeviceConsumption);
  const { request: updateDeviceRequest } = useApi(updateDevice);
  const { request: executeAction } = useApi(executeDeviceAction);
  const { request: createScheduleRequest } = useApi(createDeviceSchedule);
  const { request: updateScheduleRequest } = useApi(updateDeviceSchedule);
  const { request: deleteScheduleRequest } = useApi(deleteDeviceSchedule);

  const { register: registerAction, handleSubmit: handleActionSubmitForm, reset: resetAction } = useForm();
  const { register: registerSchedule, handleSubmit: handleScheduleSubmit, reset: resetSchedule, formState: { errors } } = useForm();

  useEffect(() => {
    loadDeviceData();
  }, [deviceId]);

  const loadDeviceData = async () => {
    try {
      await Promise.all([
        fetchDevice(deviceId),
        fetchSchedules(deviceId),
        fetchTelemetry(deviceId),
        fetchConsumption(deviceId),
      ]);
    } catch (error) {
      console.error('Failed to load device data:', error);
    }
  };

  const handleDeviceUpdate = async (field, value) => {
    try {
      await updateDeviceRequest(deviceId, { [field]: value });
      await fetchDevice(deviceId);
    } catch (error) {
      console.error('Failed to update device:', error);
    }
  };

  const handleActionSubmitLogic = async (data) => {
    try {
      setActionError('');
      const actionData = {
        action: data.action,
        payload: JSON.parse(data.payload),
      };
      await executeAction(deviceId, actionData);
      setActionDialog({ open: false });
      resetAction();
      await fetchDevice(deviceId); // Refresh device state
    } catch (error) {
      setActionError(error.response?.data?.message || 'Failed to execute action');
    }
  };

  const handleScheduleSubmitLogic = async (data) => {
    try {
      const scheduleData = {
        ...data,
        action: JSON.parse(data.action),
      };

      if (scheduleDialog.schedule) {
        await updateScheduleRequest(scheduleDialog.schedule.id, scheduleData);
      } else {
        await createScheduleRequest(deviceId, scheduleData);
      }
      setScheduleDialog({ open: false, schedule: null });
      resetSchedule();
      await fetchSchedules(deviceId);
    } catch (error) {
      console.error('Failed to save schedule:', error);
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      await deleteScheduleRequest(deleteDialog.scheduleId);
      setDeleteDialog({ open: false, scheduleId: null });
      await fetchSchedules(deviceId);
    } catch (error) {
      console.error('Failed to delete schedule:', error);
    }
  };

  const openScheduleDialog = (schedule = null) => {
    setScheduleDialog({ open: true, schedule });
    if (schedule) {
      resetSchedule({
        ...schedule,
        action: JSON.stringify(schedule.action, null, 2),
      });
    } else {
      resetSchedule({
        cron_expression: '0 9 * * *',
        action: '{"action": "set_state", "payload": {}}',
        is_enabled: true,
      });
    }
  };

  const telemetryChartOption = {
    title: {
      text: 'Device Telemetry Data',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Value'],
    },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Value',
        type: 'line',
        data: telemetry?.data_points?.map(point => [
          new Date(point.timestamp).getTime(),
          point.value
        ]) || [],
      },
    ],
  };

  const scheduleColumns = [
    {
      field: 'cron_expression',
      headerName: 'Schedule',
      width: 150,
    },
    {
      field: 'is_enabled',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Enabled' : 'Disabled'}
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
          <IconButton size="small" onClick={() => openScheduleDialog(params.row)}>
            <Edit />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => setDeleteDialog({ open: true, scheduleId: params.row.id })}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (deviceError) {
    return <ErrorDisplay error={deviceError} onRetry={loadDeviceData} />;
  }

  if (deviceLoading || !device) {
    return <LoadingOverlay message="Loading device details..." />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {device.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Type: {device.device_type_id} | Room ID: {device.room_id}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={device.is_active}
                onChange={(e) => handleDeviceUpdate('is_active', e.target.checked)}
              />
            }
            label="Device Active"
          />
          <Button variant="outlined" onClick={() => navigate(`/rooms/${device.room_id}`)}>
            Back to Room
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab label="Control & State" />
          <Tab label="Schedules" />
          <Tab label="Telemetry" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Device State
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(device.state || {}).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{JSON.stringify(value)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Device Actions
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => setActionDialog({ open: true })}
                  >
                    Execute Action
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Device Type
                    </Typography>
                    <Typography variant="body1">
                      {device.device_type_id}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={device.is_active ? 'Active' : 'Inactive'}
                      color={device.is_active ? 'success' : 'default'}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {new Date(device.updated_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Consumption Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Energy Consumption
                </Typography>
                <ChartWrapper
                  option={{
                    title: { text: 'Device Energy Consumption', left: 'center' },
                    tooltip: { trigger: 'item' },
                    series: [{
                      type: 'pie',
                      radius: '50%',
                      data: consumption ? Object.entries(consumption).map(([key, value]) => ({
                        value,
                        name: key.replace('_', ' ').toUpperCase(),
                      })) : [],
                    }],
                  }}
                  isLoading={consumptionLoading}
                  height={300}
                />
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
                Device Schedules
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => openScheduleDialog()}
              >
                Add Schedule
              </Button>
            </Box>
            
            <Box sx={{ height: 400, width: '100%', position: 'relative' }}>
              {schedulesLoading && <LoadingOverlay />}
              <DataGrid
                rows={schedules || []}
                columns={scheduleColumns}
                pageSize={10}
                rowsPerPageOptions={[10, 25]}
                disableSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {currentTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Telemetry Data
            </Typography>
            <ChartWrapper
              option={telemetryChartOption}
              isLoading={telemetryLoading}
              height={400}
            />
          </CardContent>
        </Card>
      )}

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false })} maxWidth="md" fullWidth>
        <DialogTitle>Execute Device Action</DialogTitle>
        <DialogContent>
          {actionError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {actionError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Action"
                fullWidth
                variant="outlined"
                {...registerAction('action', { required: 'Action is required' })}
                helperText="e.g., set_state, toggle, turn_on, turn_off"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Payload (JSON)"
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                {...registerAction('payload', { required: 'Payload is required' })}
                defaultValue="{}"
                helperText="Enter action payload as JSON object"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false })}>
            Cancel
          </Button>
          <Button onClick={handleActionSubmitForm(handleActionSubmitLogic)} variant="contained">
            Execute
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialog.open} onClose={() => setScheduleDialog({ open: false, schedule: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          {scheduleDialog.schedule ? 'Edit Schedule' : 'Create Schedule'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Cron Expression"
                fullWidth
                variant="outlined"
                {...registerSchedule('cron_expression', { required: 'Cron expression is required' })}
                error={!!errors.cron_expression}
                helperText={errors.cron_expression?.message || "e.g., '0 9 * * *' for daily at 9 AM"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Action (JSON)"
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                {...registerSchedule('action', { required: 'Action is required' })}
                error={!!errors.action}
                helperText={errors.action?.message || "Enter action as JSON object"}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...registerSchedule('is_enabled')}
                    defaultChecked={true}
                  />
                }
                label="Schedule Enabled"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialog({ open: false, schedule: null })}>
            Cancel
          </Button>
          <Button onClick={handleScheduleSubmit(handleScheduleSubmitLogic)} variant="contained">
            {scheduleDialog.schedule ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, scheduleId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this schedule? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, scheduleId: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteSchedule} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceDetailsPage;