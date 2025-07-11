import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { createBuilding } from '../api/endpoints';
import LoadingOverlay from '../components/common/LoadingOverlay';

const CreateBuildingPage = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const { request: createBuildingRequest, isLoading } = useApi(createBuilding);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmitError('');
      const newBuilding = await createBuildingRequest(data);
      navigate(`/buildings/${newBuilding.id}`);
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to create building');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Building
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Add a new building to your IoT management system
        </Typography>
      </Box>

      {/* Form */}
      <Card sx={{ maxWidth: 800, position: 'relative' }}>
        {isLoading && <LoadingOverlay message="Creating building..." />}
        
        <CardContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Building Name"
                  {...register('name', {
                    required: 'Building name is required',
                    minLength: {
                      value: 2,
                      message: 'Building name must be at least 2 characters',
                    },
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  {...register('address', {
                    required: 'Address is required',
                  })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  {...register('city')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  {...register('country')}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  {...register('description')}
                  helperText="Optional description of the building"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                  >
                    Create Building
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateBuildingPage;