import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAlarmStore = create(
  persist(
    (set, get) => ({
      thresholds: {
        temperature: { min: 18, max: 26, enabled: true },
        humidity: { min: 30, max: 70, enabled: true },
        energy: { max: 1000, enabled: true },
        co2: { max: 1000, enabled: true },
      },
      
      scheduledReports: [],
      
      updateThreshold: (sensor, config) => {
        set((state) => ({
          thresholds: {
            ...state.thresholds,
            [sensor]: { ...state.thresholds[sensor], ...config }
          }
        }));
      },
      
      addScheduledReport: (report) => {
        set((state) => ({
          scheduledReports: [...state.scheduledReports, { ...report, id: Date.now().toString() }]
        }));
      },
      
      removeScheduledReport: (reportId) => {
        set((state) => ({
          scheduledReports: state.scheduledReports.filter(r => r.id !== reportId)
        }));
      },
      
      updateScheduledReport: (reportId, updates) => {
        set((state) => ({
          scheduledReports: state.scheduledReports.map(r => 
            r.id === reportId ? { ...r, ...updates } : r
          )
        }));
      },
      
      checkThresholds: (sensorData) => {
        const { thresholds } = get();
        const violations = [];
        
        Object.entries(sensorData).forEach(([sensor, value]) => {
          const threshold = thresholds[sensor];
          if (!threshold || !threshold.enabled) return;
          
          if (threshold.min !== undefined && value < threshold.min) {
            violations.push({
              sensor,
              value,
              threshold: threshold.min,
              type: 'below_minimum',
              severity: 'warning'
            });
          }
          
          if (threshold.max !== undefined && value > threshold.max) {
            violations.push({
              sensor,
              value,
              threshold: threshold.max,
              type: 'above_maximum',
              severity: value > threshold.max * 1.2 ? 'critical' : 'warning'
            });
          }
        });
        
        return violations;
      },
    }),
    {
      name: 'alarm-config',
    }
  )
);

export default useAlarmStore;