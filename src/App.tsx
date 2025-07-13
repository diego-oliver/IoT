import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import lightTheme from './theme/theme';
import darkTheme from './theme/darkTheme';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotificationSystem from './components/common/NotificationSystem';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BuildingDetailsPage from './pages/BuildingDetailsPage';
import FloorDetailsPage from './pages/FloorDetailsPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import DeviceDetailsPage from './pages/DeviceDetailsPage';
import AlarmsPage from './pages/AlarmsPage';
import SettingsPage from './pages/SettingsPage';
import CreateBuildingPage from './pages/CreateBuildingPage';
import LiveMonitoringPage from './pages/LiveMonitoringPage';

function App() {
  const { isLoggedIn } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
            />
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/buildings" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CreateBuildingPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/buildings/:buildingId" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <BuildingDetailsPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/floors/:floorId" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <FloorDetailsPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rooms/:roomId" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <RoomDetailsPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/devices/:deviceId" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DeviceDetailsPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/alarms" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AlarmsPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SettingsPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/live-monitoring" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <LiveMonitoringPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
          </Routes>
          <NotificationSystem />
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;