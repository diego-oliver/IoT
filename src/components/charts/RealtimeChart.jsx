import React, { useMemo } from 'react';
import { Box, Typography, Chip, IconButton, Card, CardContent } from '@mui/material';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';
import ReactECharts from 'echarts-for-react';
import { useRealtimeData } from '../../hooks/useRealtimeData';

const RealtimeChart = ({ 
  title = 'Datos en Tiempo Real',
  deviceType = 'sensor',
  height = 300,
  showControls = true,
  color = '#1976d2',
  unit = 'units'
}) => {
  const { data, isRunning, start, stop, reset } = useRealtimeData([], {
    interval: 1500,
    maxDataPoints: 30,
    dataGenerator: () => {
      const now = new Date();
      const timeOffset = Date.now() / 1000;
      
      // Diferentes patrones según el tipo de dispositivo
      let value;
      switch (deviceType) {
        case 'temperature':
          value = 22 + Math.sin(timeOffset / 30) * 4 + Math.random() * 1;
          break;
        case 'humidity':
          value = 55 + Math.cos(timeOffset / 25) * 15 + Math.random() * 3;
          break;
        case 'energy':
          value = 120 + Math.sin(timeOffset / 20) * 60 + Math.random() * 15;
          break;
        case 'pressure':
          value = 1013 + Math.sin(timeOffset / 45) * 10 + Math.random() * 2;
          break;
        default:
          value = 50 + Math.sin(timeOffset / 35) * 30 + Math.random() * 10;
      }
      
      return {
        timestamp: now.getTime(),
        value: Math.max(0, value),
        status: Math.random() > 0.1 ? 'normal' : 'alert'
      };
    }
  });

  const chartOption = useMemo(() => {
    const timeData = data.map(point => point.timestamp);
    const valueData = data.map(point => point.value);
    const alertData = data.map(point => point.status === 'alert' ? point.value : null);

    return {
      animation: true,
      animationDuration: 300,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const time = new Date(params[0].value[0]).toLocaleTimeString();
          const value = params[0].value[1]?.toFixed(2);
          return `${time}<br/>${title}: ${value} ${unit}`;
        }
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
        name: unit,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: title,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: color,
            width: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: color + '40' },
                { offset: 1, color: color + '10' }
              ]
            }
          },
          data: data.map(point => [point.timestamp, point.value])
        },
        {
          name: 'Alertas',
          type: 'scatter',
          symbolSize: 8,
          itemStyle: {
            color: '#ff4444'
          },
          data: data
            .filter(point => point.status === 'alert')
            .map(point => [point.timestamp, point.value])
        }
      ]
    };
  }, [data, title, unit, color]);

  const currentValue = data.length > 0 ? data[data.length - 1].value : 0;
  const trend = data.length > 1 ? 
    (data[data.length - 1].value - data[data.length - 2].value) : 0;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h4" color={color}>
                {currentValue.toFixed(1)} {unit}
              </Typography>
              <Chip
                label={isRunning ? 'En Vivo' : 'Pausado'}
                color={isRunning ? 'success' : 'default'}
                size="small"
              />
              {trend !== 0 && (
                <Chip
                  label={`${trend > 0 ? '↗' : '↘'} ${Math.abs(trend).toFixed(1)}`}
                  color={trend > 0 ? 'warning' : 'info'}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          
          {showControls && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={isRunning ? stop : start} color="primary">
                {isRunning ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton onClick={reset} color="secondary">
                <Refresh />
              </IconButton>
            </Box>
          )}
        </Box>

        <ReactECharts
          option={chartOption}
          style={{ height: `${height}px` }}
          opts={{ renderer: 'canvas' }}
        />
      </CardContent>
    </Card>
  );
};

export default RealtimeChart;