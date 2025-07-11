import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { CheckCircle, Warning, Error, Info, Refresh } from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import { getAlarms, acknowledgeAlarm } from '../api/endpoints';
import ExportButton from '../components/common/ExportButton';
import ErrorDisplay from '../components/common/ErrorDisplay';
import LoadingOverlay from '../components/common/LoadingOverlay';

const AlarmsPage = () => {
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    building_id: '',
  });
  const [ackDialog, setAckDialog] = useState({ open: false, alarmId: null });

  const { data: alarms, request: fetchAlarms, isLoading: alarmsLoading, error: alarmsError } = useApi(getAlarms);
  const { request: acknowledgeAlarmRequest } = useApi(acknowledgeAlarm);

  useEffect(() => {
    loadAlarms();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadAlarms, 30000);
    return () => clearInterval(interval);
  }, [filters]);

  const loadAlarms = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      await fetchAlarms(params);
    } catch (error) {
      console.error('Failed to load alarms:', error);
    }
  };

  const handleAcknowledgeAlarm = async () => {
    try {
      await acknowledgeAlarmRequest(ackDialog.alarmId);
      setAckDialog({ open: false, alarmId: null });
      await loadAlarms();
    } catch (error) {
      console.error('Failed to acknowledge alarm:', error);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <Info />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'error';
      case 'acknowledged':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const alarmColumns = [
    {
      field: 'severity',
      headerName: 'Severity',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getSeverityIcon(params.value)}
          <Chip
            label={params.value}
            color={getSeverityColor(params.value)}
            size="small"
          />
        </Box>
      ),
    },
    {
      field: 'message',
      headerName: 'Message',
      flex: 1,
    },
    {
      field: 'source',
      headerName: 'Source',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          disabled={params.row.status === 'acknowledged' || params.row.status === 'resolved'}
          onClick={() => setAckDialog({ open: true, alarmId: params.row.id })}
        >
          Acknowledge
        </Button>
      ),
    },
  ];

  if (alarmsError) {
    return <ErrorDisplay error={alarmsError} onRetry={loadAlarms} />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Alarms & Notifications
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Monitor and manage system alarms and notifications
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadAlarms}
          sx={{ mr: 1 }}
        >
          Refresh
        </Button>
        
        <ExportButton
          data={alarms}
          filename="alarms-export"
          title="Alarms Report"
          buttonText="Export Alarms"
        />
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="acknowledged">Acknowledged</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Severity</InputLabel>
              <Select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="info">Info</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Building ID"
              value={filters.building_id}
              onChange={(e) => setFilters({ ...filters, building_id: e.target.value })}
              sx={{ minWidth: 200 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Alarms Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Active Alarms ({alarms?.length || 0})
            </Typography>
          </Box>
          
          <Box sx={{ height: 600, width: '100%', position: 'relative' }}>
            {alarmsLoading && <LoadingOverlay />}
            <DataGrid
              rows={alarms || []}
              columns={alarmColumns}
              pageSize={25}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              getRowClassName={(params) => {
                if (params.row.severity === 'critical') return 'critical-row';
                if (params.row.severity === 'warning') return 'warning-row';
                return '';
              }}
              sx={{
                '& .critical-row': {
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                },
                '& .warning-row': {
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Acknowledge Dialog */}
      <Dialog open={ackDialog.open} onClose={() => setAckDialog({ open: false, alarmId: null })}>
        <DialogTitle>Acknowledge Alarm</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to acknowledge this alarm? This will mark it as acknowledged and remove it from active alerts.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAckDialog({ open: false, alarmId: null })}>
            Cancel
          </Button>
          <Button onClick={handleAcknowledgeAlarm} variant="contained">
            Acknowledge
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlarmsPage;