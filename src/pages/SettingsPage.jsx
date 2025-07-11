import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import AlarmThresholds from '../components/settings/AlarmThresholds';
import ScheduledReports from '../components/reports/ScheduledReports';

const SettingsPage = () => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings & Configuration
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Configure system settings, alarm thresholds, and automated reports
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab label="Alarm Thresholds" />
          <Tab label="Scheduled Reports" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {currentTab === 0 && <AlarmThresholds />}
      {currentTab === 1 && <ScheduledReports />}
    </Box>
  );
};

export default SettingsPage;