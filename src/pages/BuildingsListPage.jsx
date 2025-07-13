import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add, Edit, Delete, Business } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const BuildingsListPage = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([
    {
      id: 1,
      name: 'Edificio Central',
      address: 'Av. Principal 123',
      floors: 5,
      devices: 25,
      is_simulating: true
    },
    {
      id: 2,
      name: 'Torre Norte',
      address: 'Calle Norte 456',
      floors: 8,
      devices: 40,
      is_simulating: false
    },
    {
      id: 3,
      name: 'Complejo Sur',
      address: 'Av. Sur 789',
      floors: 3,
      devices: 15,
      is_simulating: true
    }
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleCreateBuilding = () => {
    setEditingBuilding(null);
    reset({ name: '', address: '', description: '' });
    setDialogOpen(true);
  };

  const handleEditBuilding = (building) => {
    setEditingBuilding(building);
    reset(building);
    setDialogOpen(true);
  };

  const onSubmit = (data) => {
    if (editingBuilding) {
      setBuildings(prev => prev.map(b => 
        b.id === editingBuilding.id ? { ...b, ...data } : b
      ));
    } else {
      const newBuilding = {
        id: Date.now(),
        ...data,
        floors: 0,
        devices: 0,
        is_simulating: false
      };
      setBuildings(prev => [...prev, newBuilding]);
    }
    setDialogOpen(false);
    reset();
  };

  const handleDeleteBuilding = (buildingId) => {
    setBuildings(prev => prev.filter(b => b.id !== buildingId));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Gestión de Edificios
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Administra todos los edificios del sistema IoT
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateBuilding}
        >
          Nuevo Edificio
        </Button>
      </Box>

      <Grid container spacing={3}>
        {buildings.map((building) => (
          <Grid item xs={12} md={6} lg={4} key={building.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(`/buildings/${building.id}`)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Business sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditBuilding(building);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBuilding(building.id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {building.name}
                </Typography>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {building.address}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">
                    Pisos: <strong>{building.floors}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Dispositivos: <strong>{building.devices}</strong>
                  </Typography>
                </Box>

                <Chip
                  label={building.is_simulating ? 'Simulación Activa' : 'Inactivo'}
                  color={building.is_simulating ? 'success' : 'default'}
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para crear/editar edificio */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBuilding ? 'Editar Edificio' : 'Crear Nuevo Edificio'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Nombre del Edificio"
                fullWidth
                {...register('name', { required: 'El nombre es requerido' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección"
                fullWidth
                multiline
                rows={2}
                {...register('address', { required: 'La dirección es requerida' })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                {...register('description')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            {editingBuilding ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BuildingsListPage;