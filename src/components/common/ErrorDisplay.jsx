import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { RefreshCw } from 'lucide-react';

const ErrorDisplay = ({ error, onRetry, title = 'Error' }) => {
  const getErrorMessage = () => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {getErrorMessage()}
        {onRetry && (
          <Box sx={{ mt: 2 }}>
            <Button
              size="small"
              startIcon={<RefreshCw size={16} />}
              onClick={onRetry}
            >
              Retry
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorDisplay;