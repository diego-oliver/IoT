import { create } from 'zustand';

const useGlobalStore = create((set, get) => ({
  simulationStatus: null,
  dashboardKpis: null,
  notifications: [],
  
  setSimulationStatus: (status) => set({ simulationStatus: status }),
  setDashboardKpis: (kpis) => set({ dashboardKpis: kpis }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { ...notification, id: Date.now() }],
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),
  
  clearNotifications: () => set({ notifications: [] }),
}));

export default useGlobalStore;