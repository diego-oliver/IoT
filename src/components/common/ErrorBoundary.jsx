import React from 'react';
import { Box, Typography, Button, Card, CardContent, Alert } from '@mui/material';
import { RefreshCw, Home, Bug } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            backgroundColor: 'background.default'
          }}
        >
          <Card sx={{ maxWidth: 600, width: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Bug size={64} color="#ef4444" style={{ marginBottom: 16 }} />
              
              <Typography variant="h4" gutterBottom color="error">
                ¡Oops! Algo salió mal
              </Typography>
              
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Ha ocurrido un error inesperado en la aplicación. 
                Nuestro equipo ha sido notificado automáticamente.
              </Typography>

              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="body2">
                  <strong>Error:</strong> {this.state.error?.message || 'Error desconocido'}
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshCw size={20} />}
                  onClick={this.handleRetry}
                  color="primary"
                >
                  Intentar de nuevo
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Home size={20} />}
                  onClick={this.handleGoHome}
                >
                  Ir al Dashboard
                </Button>
              </Box>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <Box sx={{ mt: 3, textAlign: 'left' }}>
                  <Typography variant="h6" gutterBottom>
                    Detalles del Error (Desarrollo):
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: 'grey.100',
                      p: 2,
                      borderRadius: 1,
                      overflow: 'auto',
                      fontSize: '0.75rem',
                      maxHeight: 200
                    }}
                  >
                    {this.state.error && this.state.error.stack}
                    {this.state.errorInfo.componentStack}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;