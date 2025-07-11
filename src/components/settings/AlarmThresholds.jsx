import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Button,
  Alert,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import useAlarmStore from '../../store/alarmStore';

const AlarmThresholds = () => {
  const { thresholds, updateThreshold } = useAlarmStore();
  const [saved, setSaved] = React.useState(false);

  const handleThresholdChange = (sensor, field, value) => {
    updateThreshold(sensor, { [field]: value });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sensorConfigs = [
    {
      key: 'temperature',
      label: 'Temperature (°C)',
      hasMin: true,
      hasMax: true,
      step: 0.1,
    },
    {
      key: 'humidity',
      label: 'Humidity (%)',
      hasMin: true,
      hasMax: true,
      step: 1,
    },
    {
      key: 'energy',
      label: 'Energy Consumption (kWh)',
      hasMin: false,
      hasMax: true,
      step: 10,
    },
    {
      key: 'co2',
      label: 'CO2 Levels (ppm)',
      hasMin: false,
      hasMax: true,
      step: 50,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Alarm Thresholds Configuration
          </Typography>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Box>

        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Threshold settings saved successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          {sensorConfigs.map((config) => {
            const threshold = thresholds[config.key] || {};
            
            return (
              <Grid item xs={12} md={6} key={config.key}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {config.label}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={threshold.enabled || false}
                            onChange={(e) => handleThresholdChange(config.key, 'enabled', e.target.checked)}
                          />
                        }
                        label="Enabled"
                      />
                    </Box>

                    <Grid container spacing={2}>
                      {config.hasMin && (
                        <Grid item xs={6}>
                          <TextField
                            label="Minimum"
                            type="number"
                            fullWidth
                            size="small"
                            value={threshold.min || ''}
                            onChange={(e) => handleThresholdChange(config.key, 'min', parseFloat(e.target.value))}
                            disabled={!threshold.enabled}
                            inputProps={{ step: config.step }}
                          />
                        </Grid>
                      )}
                      {config.hasMax && (
                        <Grid item xs={config.hasMin ? 6 : 12}>
                          <TextField
                            label="Maximum"
                            type="number"
                            fullWidth
                            size="small"
                            value={threshold.max || ''}
                            onChange={(e) => handleThresholdChange(config.key, 'max', parseFloat(e.target.value))}
                            disabled={!threshold.enabled}
                            inputProps={{ step: config.step }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AlarmThresholds;