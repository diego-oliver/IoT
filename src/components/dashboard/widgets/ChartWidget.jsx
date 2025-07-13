import React, { useEffect } from 'react';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';
import ChartWrapper from '../../common/ChartWrapper';
import { useApi } from '../../../hooks/useApi';
import { useRealtimeData } from '../../../hooks/useRealtimeData';
import { getDashboardKpis } from '../../../api/endpoints';

const ChartWidget = () => {
  const { data: kpis, request: fetchKpis, isLoading } = useApi(getDashboardKpis);
  const [isLiveMode, setIsLiveMode] = React.useState(true);
  
  // Datos en tiempo real simulados
  const { data: liveData } = useRealtimeData([], {
    interval: 3000,
    maxDataPoints: 20,
    autoStart: isLiveMode,
    dataGenerator: () => {
      const now = new Date();
      return {
        timestamp: now.getTime(),
        activeBuildings: Math.floor(Math.random() * 5) + (kpis?.total_buildings || 10),
        inactiveBuildings: Math.floor(Math.random() * 3) + 2,
        energyConsumption: 100 + Math.sin(Date.now() / 10000) * 50 + Math.random() * 20
      };
    }
  });

  useEffect(() => {
    fetchKpis();
  }, []);

  const getChartOption = () => {
    if (isLiveMode && liveData.length > 0) {
      // Gráfico de línea en tiempo real
      return {
        title: {
          text: 'Rendimiento en Tiempo Real',
          left: 'center',
          textStyle: { fontSize: 14 }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const time = new Date(params[0].axisValue).toLocaleTimeString();
            return `${time}<br/>Consumo: ${params[0].value.toFixed(1)} kWh`;
          }
        },
        xAxis: {
          type: 'time',
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          name: 'kWh',
          splitLine: { lineStyle: { type: 'dashed' } }
        },
        series: [{
          name: 'Consumo Energético',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#1976d2', width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#1976d240' },
                { offset: 1, color: '#1976d210' }
              ]
            }
          },
          data: liveData.map(point => [point.timestamp, point.energyConsumption])
        }]
      };
    }
    
    // Gráfico estático original
    return {
    title: {
      text: 'Resumen de Rendimiento',
      left: 'center',
      textStyle: { fontSize: 14 }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { fontSize: 10 }
    },
    series: [
      {
        name: 'Edificios',
        type: 'pie',
        radius: ['40%', '60%'],
        data: [
          { value: kpis?.total_buildings - (kpis?.active_devices || 0), name: 'Edificios Inactivos' },
          { value: kpis?.active_devices || 0, name: 'Edificios Activos' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
    };
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Análisis de Rendimiento
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isLiveMode}
              onChange={(e) => setIsLiveMode(e.target.checked)}
              size="small"
              color="success"
            />
          }
          label="Live"
          sx={{ m: 0 }}
        />
      </Box>
      
      <ChartWrapper
        option={getChartOption()}
        isLoading={isLoading}
        height={180}
      />
    </Box>
  );
};

export default ChartWidget;