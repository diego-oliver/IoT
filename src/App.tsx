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
import CustomizableDashboard from './components/dashboard/CustomizableDashboard';
import BuildingDetailsPage from './pages/BuildingDetailsPage';
import CreateBuildingPage from './pages/CreateBuildingPage';
import FloorDetailsPage from './pages/FloorDetailsPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import DeviceDetailsPage from './pages/DeviceDetailsPage';
import AlarmsPage from './pages/AlarmsPage';
import SettingsPage from './pages/SettingsPage';
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
              path="/*" 
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              } 
            >
              <Route path="dashboard" element={<CustomizableDashboard />} />
              <Route path="buildings/new" element={<CreateBuildingPage />} />
              <Route path="buildings/:buildingId" element={<BuildingDetailsPage />} />
              <Route path="alarms" element={<AlarmsPage />} />
              <Route path="live-monitoring" element={<LiveMonitoringPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="floors/:floorId" element={<FloorDetailsPage />} />
              <Route path="rooms/:roomId" element={<RoomDetailsPage />} />
              <Route path="devices/:deviceId" element={<DeviceDetailsPage />} />
            </Route>
          </Routes>
          <NotificationSystem />
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;