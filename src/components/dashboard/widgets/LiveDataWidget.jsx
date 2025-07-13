import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { TrendingUp, TrendingDown, Minus } from '@mui/icons-material';
import { useRealtimeData } from '../../../hooks/useRealtimeData';

const LiveDataWidget = () => {
  const temperatureData = useRealtimeData([], {
    interval: 2000,
    maxDataPoints: 10,
    dataGenerator: () => ({
      timestamp: new Date().toISOString(),
      value: 22 + Math.sin(Date.now() / 30000) * 4 + Math.random() * 1
    })
  });

  const humidityData = useRealtimeData([], {
    interval: 2500,
    maxDataPoints: 10,
    dataGenerator: () => ({
      timestamp: new Date().toISOString(),
      value: 55 + Math.cos(Date.now() / 25000) * 15 + Math.random() * 3
    })
  });

  const energyData = useRealtimeData([], {
    interval: 3000,
    maxDataPoints: 10,
    dataGenerator: () => ({
      timestamp: new Date().toISOString(),
      value: 120 + Math.sin(Date.now() / 20000) * 60 + Math.random() * 15
    })
  });

  const getTrend = (data) => {
    if (data.length < 2) return 'stable';
    const current = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    const diff = current - previous;
    
    if (Math.abs(diff) < 0.5) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <TrendingDown color="error" />;
      default: return <Minus color="action" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'success.main';
      case 'down': return 'error.main';
      default: return 'text.secondary';
    }
  };

  const metrics = [
    {
      title: 'Temperatura',
      data: temperatureData.data,
      unit: '°C',
      color: '#ff6b35'
    },
    {
      title: 'Humedad',
      data: humidityData.data,
      unit: '%',
      color: '#4ecdc4'
    },
    {
      title: 'Energía',
      data: energyData.data,
      unit: 'kWh',
      color: '#45b7d1'
    }
  ];

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Datos en Vivo
      </Typography>
      
      <Grid container spacing={2} sx={{ height: 'calc(100% - 40px)' }}>
        {metrics.map((metric, index) => {
          const currentValue = metric.data.length > 0 ? 
            metric.data[metric.data.length - 1].value : 0;
          const trend = getTrend(metric.data);
          
          return (
            <Grid item xs={12} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderLeft: `4px solid ${metric.color}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {metric.title}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: metric.color,
                          fontWeight: 'bold',
                          fontFamily: 'monospace'
                        }}
                      >
                        {currentValue.toFixed(1)} {metric.unit}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: getTrendColor(trend) }}>
                      {getTrendIcon(trend)}
                    </Box>
                  </Box>
                  
                  {/* Mini gráfico de barras */}
                  <Box sx={{ display: 'flex', alignItems: 'end', gap: 0.5, mt: 1, height: 20 }}>
                    {metric.data.slice(-8).map((point, idx) => {
                      const maxValue = Math.max(...metric.data.map(d => d.value));
                      const height = (point.value / maxValue) * 20;
                      
                      return (
                        <Box
                          key={idx}
                          sx={{
                            width: 4,
                            height: `${height}px`,
                            backgroundColor: metric.color,
                            opacity: 0.3 + (idx / 8) * 0.7,
                            borderRadius: 0.5,
                            transition: 'all 0.3s ease'
                          }}
                        />
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default LiveDataWidget;