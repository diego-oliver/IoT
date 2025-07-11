import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Fab,
} from '@mui/material';
import {
  Edit,
  Close,
  Add,
  Save,
  Refresh,
  Settings,
} from '@mui/icons-material';
import useDashboardStore from '../../store/dashboardStore';
import KPIWidget from './widgets/KPIWidget';
import SimulationWidget from './widgets/SimulationWidget';
import ChartWidget from './widgets/ChartWidget';
import BuildingsWidget from './widgets/BuildingsWidget';
import AlarmsWidget from './widgets/AlarmsWidget';
import EnergyWidget from './widgets/EnergyWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetComponents = {
  kpis: KPIWidget,
  simulation: SimulationWidget,
  chart: ChartWidget,
  buildings: BuildingsWidget,
  alarms: AlarmsWidget,
  energy: EnergyWidget,
};

const availableWidgets = [
  { type: 'kpis', title: 'KPI Dashboard', defaultSize: { w: 12, h: 2 } },
  { type: 'simulation', title: 'Simulation Control', defaultSize: { w: 4, h: 3 } },
  { type: 'chart', title: 'Performance Chart', defaultSize: { w: 8, h: 3 } },
  { type: 'buildings', title: 'Buildings Table', defaultSize: { w: 12, h: 4 } },
  { type: 'alarms', title: 'Recent Alarms', defaultSize: { w: 6, h: 3 } },
  { type: 'energy', title: 'Energy Consumption', defaultSize: { w: 6, h: 3 } },
];

const CustomizableDashboard = () => {
  const { widgets, isEditMode, updateWidgetLayout, toggleEditMode, addWidget, removeWidget, resetLayout } = useDashboardStore();
  const [addWidgetDialog, setAddWidgetDialog] = useState(false);
  const [selectedWidgetType, setSelectedWidgetType] = useState('');

  const handleLayoutChange = (layout) => {
    if (isEditMode) {
      const updatedWidgets = widgets.map(widget => {
        const layoutItem = layout.find(l => l.i === widget.id);
        return layoutItem ? { ...widget, ...layoutItem } : widget;
      });
      updateWidgetLayout(updatedWidgets);
    }
  };

  const handleAddWidget = () => {
    const widgetConfig = availableWidgets.find(w => w.type === selectedWidgetType);
    if (widgetConfig) {
      const newWidget = {
        type: selectedWidgetType,
        title: widgetConfig.title,
        x: 0,
        y: 0,
        ...widgetConfig.defaultSize,
      };
      addWidget(newWidget);
      setAddWidgetDialog(false);
      setSelectedWidgetType('');
    }
  };

  const renderWidget = (widget) => {
    const WidgetComponent = widgetComponents[widget.type];
    if (!WidgetComponent) return null;

    return (
      <Card key={widget.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title={widget.title}
          action={
            isEditMode && (
              <IconButton
                size="small"
                onClick={() => removeWidget(widget.id)}
                color="error"
              >
                <Close />
              </IconButton>
            )
          }
          sx={{ pb: 1 }}
        />
        <CardContent sx={{ flex: 1, pt: 0, overflow: 'hidden' }}>
          <WidgetComponent />
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Control Panel */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button
          variant={isEditMode ? 'contained' : 'outlined'}
          startIcon={isEditMode ? <Save /> : <Edit />}
          onClick={toggleEditMode}
          color={isEditMode ? 'success' : 'primary'}
        >
          {isEditMode ? 'Save Layout' : 'Edit Layout'}
        </Button>
        
        {isEditMode && (
          <>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setAddWidgetDialog(true)}
            >
              Add Widget
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={resetLayout}
            >
              Reset Layout
            </Button>
          </>
        )}
      </Box>

      {/* Dashboard Grid */}
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: widgets }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        margin={[16, 16]}
        containerPadding={[0, 0]}
      >
        {widgets.map(renderWidget)}
      </ResponsiveGridLayout>

      {/* Add Widget Dialog */}
      <Dialog open={addWidgetDialog} onClose={() => setAddWidgetDialog(false)}>
        <DialogTitle>Add Widget</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Widget Type</InputLabel>
            <Select
              value={selectedWidgetType}
              onChange={(e) => setSelectedWidgetType(e.target.value)}
            >
              {availableWidgets.map((widget) => (
                <MenuItem key={widget.type} value={widget.type}>
                  {widget.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddWidgetDialog(false)}>Cancel</Button>
          <Button onClick={handleAddWidget} variant="contained" disabled={!selectedWidgetType}>
            Add Widget
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Settings />
        </Fab>
      )}
    </Box>
  );
};

export default CustomizableDashboard;