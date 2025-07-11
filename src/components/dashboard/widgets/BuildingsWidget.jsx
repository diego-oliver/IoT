import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Chip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';
import { getBuildings } from '../../../api/endpoints';

const BuildingsWidget = () => {
  const navigate = useNavigate();
  const { data: buildings, request: fetchBuildings, isLoading } = useApi(getBuildings);

  useEffect(() => {
    fetchBuildings({ skip: 0, limit: 10 });
  }, []);

  const buildingColumns = [
    {
      field: 'name',
      headerName: 'Building',
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
          onClick={() => navigate(`/buildings/${params.row.id}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'is_simulating',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={buildings || []}
        columns={buildingColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        loading={isLoading}
        hideFooter
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
        }}
      />
    </Box>
  );
};

export default BuildingsWidget;