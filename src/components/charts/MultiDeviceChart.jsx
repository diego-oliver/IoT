import React, { useMemo } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, IconButton } from '@mui/material';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';
import ReactECharts from 'echarts-for-react';
import { useMultiDeviceData } from '../../hooks/useRealtimeData';

const MultiDeviceChart = ({ devices = [], height = 400 }) => {
  const { devicesData, isRunning, start, stop, reset } = useMultiDeviceData(devices);

  const chartOption = useMemo(() => {
    const series = devices.map((device, index) => {
      const devicePoints = devicesData[device.id] || [];
      const colors = ['#1976d2', '#dc004e', '#9c27b0', '#2e7d32', '#ed6c02', '#0288d1'];
      const color = colors[index % colors.length];

      return {
        name: device.name,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: color,
          width: 2
        },
        data: devicePoints.map(point => [
          new Date(point.timestamp).getTime(),
          point.value
        ])
      };
    });

    return {
      animation: true,
      animationDuration: 300,
      title: {
        text: 'Monitoreo Multi-Dispositivo',
        left: 'center',
        textStyle: {
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const time = new Date(params[0].axisValue).toLocaleTimeString();
          let content = `<strong>${time}</strong><br/>`;
          params.forEach(param => {
            content += `${param.seriesName}: ${param.value[1]?.toFixed(2)}<br/>`;
          });
          return content;
        }
      },
      legend: {
        data: devices.map(device => device.name),
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: (value) => new Date(value).toLocaleTimeString()
        }
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: series
    };
  }, [devices, devicesData]);

  const getDeviceStatus = (deviceId) => {
    const devicePoints = devicesData[deviceId] || [];
    if (devicePoints.length === 0) return 'Sin datos';
    
    const lastPoint = devicePoints[devicePoints.length - 1];
    return lastPoint.status === 'active' ? 'Activo' : 'Alerta';
  };

  const getDeviceValue = (deviceId) => {
    const devicePoints = devicesData[deviceId] || [];
    if (devicePoints.length === 0) return 0;
    
    return devicePoints[devicePoints.length - 1].value;
  };

  return (
    <Box>
      {/* Controles y Estado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Dispositivos en Tiempo Real ({devices.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip
            label={isRunning ? 'Transmitiendo' : 'Pausado'}
            color={isRunning ? 'success' : 'default'}
            variant="filled"
          />
          <IconButton onClick={isRunning ? stop : start} color="primary">
            {isRunning ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton onClick={reset} color="secondary">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Gráfico Principal */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <ReactECharts
            option={chartOption}
            style={{ height: `${height}px` }}
            opts={{ renderer: 'canvas' }}
          />
        </CardContent>
      </Card>

      {/* Cards de Estado de Dispositivos */}
      <Grid container spacing={2}>
        {devices.map((device) => {
          const status = getDeviceStatus(device.id);
          const value = getDeviceValue(device.id);
          const isActive = status === 'Activo';

          return (
            <Grid item xs={12} sm={6} md={4} key={device.id}>
              <Card 
                sx={{ 
                  border: isActive ? '2px solid #4caf50' : '2px solid #ff9800',
                  backgroundColor: isActive ? 'rgba(76, 175, 80, 0.05)' : 'rgba(255, 152, 0, 0.05)'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        {device.type?.replace('_', ' ').toUpperCase()}
                      </Typography>
                      <Typography variant="h6" noWrap>
                        {device.name}
                      </Typography>
                      <Typography variant="h4" color={isActive ? 'success.main' : 'warning.main'}>
                        {value.toFixed(1)}
                      </Typography>
                    </Box>
                    <Chip
                      label={status}
                      color={isActive ? 'success' : 'warning'}
                      size="small"
                    />
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

export default MultiDeviceChart;