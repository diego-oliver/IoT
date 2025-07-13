import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid } from '@mui/material';

export const DashboardSkeleton = () => (
  <Box sx={{ width: '100%' }}>
    {/* KPI Cards Skeleton */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[...Array(4)].map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={40} />
                </Box>
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Chart and Controls Skeleton */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="70%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={200} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="50%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={200} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    {/* Table Skeleton */}
    <Card>
      <CardContent>
        <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={48} />
          ))}
        </Box>
      </CardContent>
    </Card>
  </Box>
);

export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <Box sx={{ width: '100%' }}>
    {/* Header */}
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      {[...Array(columns)].map((_, index) => (
        <Skeleton key={index} variant="text" width="20%" height={32} />
      ))}
    </Box>
    
    {/* Rows */}
    {[...Array(rows)].map((_, rowIndex) => (
      <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 1 }}>
        {[...Array(columns)].map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" width="20%" height={24} />
        ))}
      </Box>
    ))}
  </Box>
);

export const ChartSkeleton = ({ height = 300 }) => (
  <Box sx={{ width: '100%', p: 2 }}>
    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" width="100%" height={height} />
  </Box>
);

export const CardSkeleton = ({ lines = 3 }) => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
      {[...Array(lines)].map((_, index) => (
        <Skeleton key={index} variant="text" width="100%" height={20} sx={{ mb: 1 }} />
      ))}
    </CardContent>
  </Card>
);