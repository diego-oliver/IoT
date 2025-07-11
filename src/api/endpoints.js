import apiClient from './client';

// Dashboard & KPIs
export const getDashboardKpis = () => apiClient.get('/kpi/dashboard');

// Buildings
export const getBuildings = (params = {}) => apiClient.get('/buildings', { params });
export const getBuilding = (buildingId) => apiClient.get(`/buildings/${buildingId}`);
export const createBuilding = (data) => apiClient.post('/buildings', data);
export const updateBuilding = (buildingId, data) => apiClient.put(`/buildings/${buildingId}`, data);
export const deleteBuilding = (buildingId) => apiClient.delete(`/buildings/${buildingId}`);
export const getBuildingLiveData = (buildingId) => apiClient.get(`/buildings/${buildingId}/live_data`);
export const getBuildingData = (buildingId, params = {}) => apiClient.get(`/buildings/${buildingId}/data`, { params });
export const simulateBuilding = (buildingId, status) => apiClient.post(`/buildings/${buildingId}/simulate?status=${status}`);

// Building Consumption
export const getBuildingConsumption = (buildingId) => apiClient.get(`/consumption/building/${buildingId}`);
export const getFloorConsumption = (floorId) => apiClient.get(`/consumption/floor/${floorId}`);
export const getRoomConsumption = (roomId) => apiClient.get(`/consumption/room/${roomId}`);
export const getDeviceConsumption = (deviceId) => apiClient.get(`/consumption/device/${deviceId}`);

// Floors
export const getBuildingFloors = (buildingId, params = {}) => apiClient.get(`/buildings/${buildingId}/floors`, { params });
export const getFloor = (floorId) => apiClient.get(`/floors/${floorId}`);
export const createFloor = (buildingId, data) => apiClient.post(`/buildings/${buildingId}/floors`, data);
export const updateFloor = (floorId, data) => apiClient.put(`/floors/${floorId}`, data);
export const deleteFloor = (floorId) => apiClient.delete(`/floors/${floorId}`);
export const simulateFloor = (floorId, status) => apiClient.post(`/floors/${floorId}/simulate?status=${status}`);

// Rooms
export const getFloorRooms = (floorId, params = {}) => apiClient.get(`/floors/${floorId}/rooms`, { params });
export const getRoom = (roomId) => apiClient.get(`/rooms/${roomId}`);
export const createRoom = (floorId, data) => apiClient.post(`/floors/${floorId}/rooms`, data);
export const updateRoom = (roomId, data) => apiClient.put(`/rooms/${roomId}`, data);
export const deleteRoom = (roomId) => apiClient.delete(`/rooms/${roomId}`);
export const simulateRoom = (roomId, status) => apiClient.post(`/rooms/${roomId}/simulate?status=${status}`);

// Devices
export const getRoomDevices = (roomId, params = {}) => apiClient.get(`/rooms/${roomId}/devices`, { params });
export const getDevice = (deviceId) => apiClient.get(`/devices/${deviceId}`);
export const createDevice = (roomId, data) => apiClient.post(`/rooms/${roomId}/devices`, data);
export const updateDevice = (deviceId, data) => apiClient.put(`/devices/${deviceId}`, data);
export const deleteDevice = (deviceId) => apiClient.delete(`/devices/${deviceId}`);
export const executeDeviceAction = (deviceId, action) => apiClient.post(`/devices/${deviceId}/actions`, action);

// Device Types
export const getDeviceTypes = (params = {}) => apiClient.get('/device-types', { params });
export const getDeviceType = (deviceTypeId) => apiClient.get(`/device-types/${deviceTypeId}`);
export const createDeviceType = (data) => apiClient.post('/device-types', data);
export const updateDeviceType = (deviceTypeId, data) => apiClient.put(`/device-types/${deviceTypeId}`, data);
export const deleteDeviceType = (deviceTypeId) => apiClient.delete(`/device-types/${deviceTypeId}`);

// Device Schedules
export const getDeviceSchedules = (deviceId) => apiClient.get(`/devices/${deviceId}/schedules`);
export const getSchedule = (scheduleId) => apiClient.get(`/schedules/${scheduleId}`);
export const createDeviceSchedule = (deviceId, data) => apiClient.post(`/devices/${deviceId}/schedules`, data);
export const updateDeviceSchedule = (scheduleId, data) => apiClient.put(`/schedules/${scheduleId}`, data);
export const deleteDeviceSchedule = (scheduleId) => apiClient.delete(`/schedules/${scheduleId}`);

// Simulation
export const getSimulationStatus = () => apiClient.get('/simulation/status');
export const startGlobalSimulation = () => apiClient.post('/simulations/start_global');
export const stopGlobalSimulation = () => apiClient.post('/simulations/stop_global');
export const stopSimulation = () => apiClient.post('/simulation/stop');
export const startNewBuildingSimulation = () => apiClient.post('/simulations/start_new_building_simulation');
export const getSimulationStatusById = (simulationId) => apiClient.get(`/simulations/${simulationId}/status`);

// Alarms
export const getAlarms = (params = {}) => apiClient.get('/alarms', { params });
export const acknowledgeAlarm = (alarmId) => apiClient.post(`/alarms/${alarmId}/ack`);

// Telemetry
export const getDeviceTelemetry = (deviceId, params = {}) => apiClient.get(`/telemetry/device/${deviceId}`, { params });

// Templates
export const getTemplates = () => apiClient.get('/templates');
export const getTemplate = (name) => apiClient.get(`/templates/${name}`);
export const saveTemplate = (name, data) => apiClient.post(`/templates/${name}`, data);