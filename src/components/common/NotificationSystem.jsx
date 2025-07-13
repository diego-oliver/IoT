import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Slide,
  Fade
} from '@mui/material';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { create } from 'zustand';

// Store para notificaciones
const useNotificationStore = create((set, get) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      type: 'info',
      autoHide: true,
      duration: 5000,
      ...notification,
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));
    
    // Auto-remove notification
    if (newNotification.autoHide) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }
    
    return id;
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  clearAll: () => {
    set({ notifications: [] });
  }
}));

// Hook para usar notificaciones
export const useNotifications = () => {
  const { addNotification, removeNotification, clearAll } = useNotificationStore();
  
  const showSuccess = (message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  };
  
  const showError = (message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      autoHide: false,
      ...options
    });
  };
  
  const showWarning = (message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      duration: 7000,
      ...options
    });
  };
  
  const showInfo = (message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  };
  
  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll
  };
};

// Componente de notificación individual
const NotificationItem = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Alert
        severity={notification.type}
        icon={getIcon()}
        action={
          <IconButton
            size="small"
            onClick={() => onClose(notification.id)}
            sx={{ color: 'inherit' }}
          >
            <X size={16} />
          </IconButton>
        }
        sx={{
          mb: 1,
          minWidth: 300,
          maxWidth: 500,
          boxShadow: 3,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        {notification.title && (
          <AlertTitle>{notification.title}</AlertTitle>
        )}
        {notification.message}
      </Alert>
    </Slide>
  );
};

// Sistema de notificaciones principal
const NotificationSystem = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        '& > *': {
          pointerEvents: 'auto'
        }
      }}
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </Box>
  );
};

export default NotificationSystem;