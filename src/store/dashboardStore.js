import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultWidgets = [
  { id: 'kpis', type: 'kpis', x: 0, y: 0, w: 12, h: 2, title: 'Key Performance Indicators' },
  { id: 'simulation', type: 'simulation', x: 0, y: 2, w: 4, h: 3, title: 'Simulation Control' },
  { id: 'chart', type: 'chart', x: 4, y: 2, w: 8, h: 3, title: 'Building Performance' },
  { id: 'buildings', type: 'buildings', x: 0, y: 5, w: 12, h: 4, title: 'Buildings Overview' },
  { id: 'alarms', type: 'alarms', x: 0, y: 9, w: 6, h: 3, title: 'Recent Alarms' },
  { id: 'energy', type: 'energy', x: 6, y: 9, w: 6, h: 3, title: 'Energy Consumption' },
];

const useDashboardStore = create(
  persist(
    (set, get) => ({
      widgets: defaultWidgets,
      isEditMode: false,
      
      updateWidgetLayout: (layouts) => {
        set({ widgets: layouts });
      },
      
      toggleEditMode: () => {
        set((state) => ({ isEditMode: !state.isEditMode }));
      },
      
      addWidget: (widget) => {
        set((state) => ({
          widgets: [...state.widgets, { ...widget, id: Date.now().toString() }]
        }));
      },
      
      removeWidget: (widgetId) => {
        set((state) => ({
          widgets: state.widgets.filter(w => w.id !== widgetId)
        }));
      },
      
      resetLayout: () => {
        set({ widgets: defaultWidgets });
      },
    }),
    {
      name: 'dashboard-layout',
    }
  )
);

export default useDashboardStore;