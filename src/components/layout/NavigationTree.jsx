import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Skeleton,
} from '@mui/material';
import {
  Dashboard,
  Business,
  Layers,
  Room,
  DeviceHub,
  ExpandLess,
  ExpandMore,
  Warning,
  Settings,
  Timeline,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { getBuildings, getBuildingFloors, getFloorRooms } from '../../api/endpoints';

const NavigationTree = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: buildings, request: fetchBuildings, isLoading } = useApi(getBuildings);
  
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [floorsData, setFloorsData] = useState({});
  const [roomsData, setRoomsData] = useState({});

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  const handleToggleExpand = async (itemId, type, parentId = null) => {
    const newExpanded = new Set(expandedItems);
    
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
      
      // Load data when expanding
      if (type === 'building' && !floorsData[itemId]) {
        try {
          const response = await getBuildingFloors(itemId);
          setFloorsData(prev => ({ ...prev, [itemId]: response.data }));
        } catch (error) {
          console.error('Failed to load floors:', error);
        }
      } else if (type === 'floor' && !roomsData[itemId]) {
        try {
          const response = await getFloorRooms(itemId);
          setRoomsData(prev => ({ ...prev, [itemId]: response.data }));
        } catch (error) {
          console.error('Failed to load rooms:', error);
        }
      }
    }
    
    setExpandedItems(newExpanded);
  };

  const isActive = (path) => location.pathname === path;

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height={48} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {/* Dashboard */}
      <ListItemButton
        selected={isActive('/dashboard')}
        onClick={() => navigate('/dashboard')}
      >
        <ListItemIcon>
          <Dashboard />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      {/* Live Monitoring */}
      <ListItemButton
        selected={isActive('/live-monitoring')}
        onClick={() => navigate('/live-monitoring')}
      >
        <ListItemIcon>
          <Timeline />
        </ListItemIcon>
        <ListItemText primary="Monitoreo en Vivo" />
      </ListItemButton>

      {/* Alarms */}
      <ListItemButton
        selected={isActive('/alarms')}
        onClick={() => navigate('/alarms')}
      >
        <ListItemIcon>
          <Warning />
        </ListItemIcon>
        <ListItemText primary="Alarms" />
      </ListItemButton>

      {/* Settings */}
      <ListItemButton
        selected={isActive('/settings')}
        onClick={() => navigate('/settings')}
      >
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>

      {/* Buildings */}
      {buildings?.map((building) => (
        <Box key={building.id}>
          <ListItemButton
            onClick={() => handleToggleExpand(building.id, 'building')}
            selected={isActive(`/buildings/${building.id}`)}
          >
            <ListItemIcon>
              <Business />
            </ListItemIcon>
            <ListItemText 
              primary={building.name}
              secondary={building.address}
            />
            {expandedItems.has(building.id) ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          
          <Collapse in={expandedItems.has(building.id)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Building Details Link */}
              <ListItemButton
                sx={{ pl: 4 }}
                selected={isActive(`/buildings/${building.id}`)}
                onClick={() => navigate(`/buildings/${building.id}`)}
              >
                <ListItemIcon>
                  <Business />
                </ListItemIcon>
                <ListItemText primary="Building Details" />
              </ListItemButton>
              
              {/* Floors */}
              {floorsData[building.id]?.map((floor) => (
                <Box key={floor.id}>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => handleToggleExpand(floor.id, 'floor', building.id)}
                  >
                    <ListItemIcon>
                      <Layers />
                    </ListItemIcon>
                    <ListItemText primary={`Floor ${floor.floor_number}`} />
                    {expandedItems.has(floor.id) ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  
                  <Collapse in={expandedItems.has(floor.id)} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {/* Floor Details Link */}
                      <ListItemButton
                        sx={{ pl: 6 }}
                        selected={isActive(`/floors/${floor.id}`)}
                        onClick={() => navigate(`/floors/${floor.id}`)}
                      >
                        <ListItemIcon>
                          <Layers />
                        </ListItemIcon>
                        <ListItemText primary="Floor Details" />
                      </ListItemButton>
                      
                      {/* Rooms */}
                      {roomsData[floor.id]?.map((room) => (
                        <ListItemButton
                          key={room.id}
                          sx={{ pl: 6 }}
                          selected={isActive(`/rooms/${room.id}`)}
                          onClick={() => navigate(`/rooms/${room.id}`)}
                        >
                          <ListItemIcon>
                            <Room />
                          </ListItemIcon>
                          <ListItemText primary={room.name} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              ))}
            </List>
          </Collapse>
        </Box>
      ))}
    </List>
  );
};

export default NavigationTree;