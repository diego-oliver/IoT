import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Box, Skeleton } from '@mui/material';

const ChartWrapper = ({ option, isLoading, height = 400, ...props }) => {
  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={height} />
      </Box>
    );
  }

  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px` }}
      opts={{ renderer: 'canvas' }}
      {...props}
    />
  );
};

export default ChartWrapper;