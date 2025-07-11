import React, { useEffect } from 'react';
import { List, ListItem, ListItemText, Chip, Typography, Box } from '@mui/material';
import { useApi } from '../../../hooks/useApi';
import { getAlarms } from '../../../api/endpoints';

const AlarmsWidget = () => {
  const { data: alarms, request: fetchAlarms, isLoading } = useApi(getAlarms);

  useEffect(() => {
    fetchAlarms({ limit: 5 });
  }, []);

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

  if (isLoading) {
    return <Typography>Loading alarms...</Typography>;
  }

  if (!alarms || alarms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography color="textSecondary">No recent alarms</Typography>
      </Box>
    );
  }

  return (
    <List dense sx={{ height: '100%', overflow: 'auto' }}>
      {alarms.slice(0, 5).map((alarm) => (
        <ListItem key={alarm.id} divider>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={alarm.severity}
                  color={getSeverityColor(alarm.severity)}
                  size="small"
                />
                <Typography variant="body2" noWrap>
                  {alarm.message}
                </Typography>
              </Box>
            }
            secondary={new Date(alarm.created_at).toLocaleString()}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default AlarmsWidget;