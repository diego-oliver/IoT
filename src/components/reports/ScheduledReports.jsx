import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Box,
} from '@mui/material';
import { Add, Delete, Edit, Schedule } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import useAlarmStore from '../../store/alarmStore';

const ScheduledReports = () => {
  const { scheduledReports, addScheduledReport, removeScheduledReport, updateScheduledReport } = useAlarmStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const reportTypes = [
    { value: 'alarms', label: 'Alarm Report' },
    { value: 'energy', label: 'Energy Consumption Report' },
    { value: 'devices', label: 'Device Status Report' },
    { value: 'buildings', label: 'Building Performance Report' },
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const formats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' },
  ];

  const handleOpenDialog = (report = null) => {
    setEditingReport(report);
    if (report) {
      reset(report);
    } else {
      reset({
        name: '',
        type: 'alarms',
        frequency: 'weekly',
        format: 'pdf',
        recipients: '',
        enabled: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingReport(null);
    reset();
  };

  const onSubmit = (data) => {
    const reportData = {
      ...data,
      recipients: data.recipients.split(',').map(email => email.trim()),
      createdAt: new Date().toISOString(),
    };

    if (editingReport) {
      updateScheduledReport(editingReport.id, reportData);
    } else {
      addScheduledReport(reportData);
    }

    handleCloseDialog();
  };

  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case 'daily': return 'success';
      case 'weekly': return 'primary';
      case 'monthly': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Scheduled Reports
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Schedule Report
          </Button>
        </Box>

        {scheduledReports.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Scheduled Reports
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Create your first scheduled report to receive automated updates
            </Typography>
          </Box>
        ) : (
          <List>
            {scheduledReports.map((report) => (
              <ListItem key={report.id} divider>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{report.name}</Typography>
                      <Chip
                        label={report.frequency}
                        color={getFrequencyColor(report.frequency)}
                        size="small"
                      />
                      <Chip
                        label={report.format.toUpperCase()}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Type: {reportTypes.find(t => t.value === report.type)?.label}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Recipients: {report.recipients?.join(', ')}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleOpenDialog(report)}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => removeScheduledReport(report.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}

        {/* Schedule Report Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingReport ? 'Edit Scheduled Report' : 'Schedule New Report'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Report Name"
                  fullWidth
                  {...register('name', { required: 'Report name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select {...register('type', { required: true })}>
                    {reportTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select {...register('frequency', { required: true })}>
                    {frequencies.map((freq) => (
                      <MenuItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Format</InputLabel>
                  <Select {...register('format', { required: true })}>
                    {formats.map((format) => (
                      <MenuItem key={format.value} value={format.value}>
                        {format.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Recipients (comma-separated emails)"
                  fullWidth
                  multiline
                  rows={2}
                  {...register('recipients', { required: 'At least one recipient is required' })}
                  error={!!errors.recipients}
                  helperText={errors.recipients?.message || 'Enter email addresses separated by commas'}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} variant="contained">
              {editingReport ? 'Update' : 'Schedule'} Report
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ScheduledReports;