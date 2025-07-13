import { useState, useCallback } from 'react';
import { useNotifications } from '../components/common/NotificationSystem';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useNotifications();

  const request = useCallback(async (...args) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      
      // Show user-friendly error notification
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Ha ocurrido un error inesperado';
      
      showError(errorMessage, {
        title: 'Error de Conexión',
        autoHide: false
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction, showError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    request,
    reset,
  };
};