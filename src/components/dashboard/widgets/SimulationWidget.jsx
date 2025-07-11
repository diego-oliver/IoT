import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, Typography, IconButton } from '@mui/material';
import { PlayArrow, Stop, Refresh } from '@mui/icons-material';
import { useApi } from '../../../hooks/useApi';
import {
  getSimulationStatus,
  startGlobalSimulation,
  stopGlobalSimulation,
} from '../../../api/endpoints';

const SimulationWidget = () => {
  const [globalSimStatus, setGlobalSimStatus] = useState(null);
  const [isSimulationLoading, setIsSimulationLoading] = useState(false);

  const { request: fetchSimStatus } = useApi(getSimulationStatus);
  const { request: startSim } = useApi(startGlobalSimulation);
  const { request: stopSim } = useApi(stopGlobalSimulation);

  useEffect(() => {
    loadSimulationStatus();
    const interval = setInterval(loadSimulationStatus, 10000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<PlayArrow />}
          onClick={() => handleSimulationToggle('start')}
          disabled={isSimulationLoading || globalSimStatus?.is_active}
          size="small"
        >
          Start
        </Button>
        
        <Button
          variant="contained"
          color="error"
          startIcon={<Stop />}
          onClick={() => handleSimulationToggle('stop')}
          disabled={isSimulationLoading || !globalSimStatus?.is_active}
          size="small"
        >
          Stop
        </Button>
        
        <IconButton
          onClick={loadSimulationStatus}
          size="small"
        >
          <Refresh />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SimulationWidget;