import { useState, useEffect, useRef, useCallback } from 'react';

// Hook para simular datos en tiempo real
export const useRealtimeData = (initialData = [], options = {}) => {
  const {
    interval = 2000, // Actualización cada 2 segundos
    maxDataPoints = 50, // Máximo de puntos en el gráfico
    autoStart = true,
    dataGenerator = null // Función personalizada para generar datos
  } = options;

  const [data, setData] = useState(initialData);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef(null);

  // Generador de datos por defecto
  const defaultDataGenerator = useCallback(() => {
    const now = new Date();
    return {
      timestamp: now.toISOString(),
      value: Math.random() * 100,
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 30,
      energy: 50 + Math.random() * 200,
      co2: 400 + Math.random() * 600
    };
  }, []);

  const generateData = dataGenerator || defaultDataGenerator;

  const addDataPoint = useCallback(() => {
    setData(prevData => {
      const newPoint = generateData();
      const updatedData = [...prevData, newPoint];
      
      // Mantener solo los últimos maxDataPoints
      if (updatedData.length > maxDataPoints) {
        return updatedData.slice(-maxDataPoints);
      }
      
      return updatedData;
    });
  }, [generateData, maxDataPoints]);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setData([]);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(addDataPoint, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, addDataPoint, interval]);

  return {
    data,
    isRunning,
    start,
    stop,
    reset,
    addDataPoint
  };
};

// Hook para simular datos de dispositivos específicos
export const useDeviceRealtimeData = (deviceId, deviceType) => {
  const dataGenerator = useCallback(() => {
    const now = new Date();
    const baseValue = Math.sin(Date.now() / 10000) * 50 + 50; // Patrón sinusoidal
    
    switch (deviceType) {
      case 'temperature_sensor':
        return {
          timestamp: now.toISOString(),
          value: 20 + Math.sin(Date.now() / 15000) * 5 + Math.random() * 2,
          unit: '°C',
          status: 'active'
        };
      
      case 'humidity_sensor':
        return {
          timestamp: now.toISOString(),
          value: 50 + Math.cos(Date.now() / 12000) * 20 + Math.random() * 5,
          unit: '%',
          status: 'active'
        };
      
      case 'energy_meter':
        return {
          timestamp: now.toISOString(),
          value: 100 + Math.sin(Date.now() / 8000) * 80 + Math.random() * 20,
          unit: 'kWh',
          status: 'active'
        };
      
      case 'hvac_system':
        return {
          timestamp: now.toISOString(),
          value: baseValue,
          temperature: 22 + Math.sin(Date.now() / 20000) * 3,
          power_consumption: 150 + Math.random() * 100,
          status: Math.random() > 0.1 ? 'active' : 'maintenance',
          unit: '%'
        };
      
      default:
        return {
          timestamp: now.toISOString(),
          value: baseValue + Math.random() * 10,
          unit: 'units',
          status: 'active'
        };
    }
  }, [deviceType]);

  return useRealtimeData([], {
    interval: 1500,
    maxDataPoints: 30,
    dataGenerator
  });
};

// Hook para múltiples dispositivos
export const useMultiDeviceData = (devices = []) => {
  const [devicesData, setDevicesData] = useState({});
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef(null);

  const generateDeviceData = useCallback((device) => {
    const now = new Date();
    const timeOffset = Date.now() / 1000;
    
    // Diferentes patrones para cada tipo de dispositivo
    const patterns = {
      temperature_sensor: () => 22 + Math.sin(timeOffset / 30) * 4 + Math.random() * 1,
      humidity_sensor: () => 55 + Math.cos(timeOffset / 25) * 15 + Math.random() * 3,
      energy_meter: () => 120 + Math.sin(timeOffset / 20) * 60 + Math.random() * 15,
      lighting_system: () => Math.random() > 0.7 ? 100 : Math.random() * 80,
      hvac_system: () => 60 + Math.sin(timeOffset / 40) * 30 + Math.random() * 10,
      security_camera: () => Math.random() > 0.95 ? 0 : 100, // Simula detección de movimiento
      air_quality: () => 400 + Math.sin(timeOffset / 35) * 200 + Math.random() * 50
    };

    const pattern = patterns[device.type] || (() => Math.random() * 100);
    
    return {
      deviceId: device.id,
      timestamp: now.toISOString(),
      value: pattern(),
      status: Math.random() > 0.05 ? 'active' : 'warning', // 5% chance de warning
      type: device.type,
      name: device.name
    };
  }, []);

  const updateAllDevices = useCallback(() => {
    setDevicesData(prevData => {
      const newData = { ...prevData };
      
      devices.forEach(device => {
        const deviceData = newData[device.id] || [];
        const newPoint = generateDeviceData(device);
        const updatedDeviceData = [...deviceData, newPoint];
        
        // Mantener solo los últimos 40 puntos por dispositivo
        newData[device.id] = updatedDeviceData.slice(-40);
      });
      
      return newData;
    });
  }, [devices, generateDeviceData]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => setDevicesData({});

  useEffect(() => {
    if (isRunning && devices.length > 0) {
      intervalRef.current = setInterval(updateAllDevices, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, updateAllDevices, devices.length]);

  return {
    devicesData,
    isRunning,
    start,
    stop,
    reset
  };
};