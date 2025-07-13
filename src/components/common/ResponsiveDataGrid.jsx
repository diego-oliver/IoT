import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery,
  Chip,
  Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ResponsiveDataGrid = ({ 
  rows, 
  columns, 
  title,
  mobileCardRenderer,
  loading = false,
  ...gridProps 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (rowId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  // Renderizado móvil con cards
  const MobileCardView = () => (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2, px: 1 }}>
          {title}
        </Typography>
      )}
      
      <List sx={{ width: '100%', p: 0 }}>
        {rows.map((row, index) => {
          const isExpanded = expandedRows.has(row.id);
          
          return (
            <Card key={row.id} sx={{ mb: 1 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {mobileCardRenderer ? (
                  mobileCardRenderer(row, isExpanded, () => toggleRowExpansion(row.id))
                ) : (
                  <DefaultMobileCard 
                    row={row} 
                    columns={columns}
                    isExpanded={isExpanded}
                    onToggle={() => toggleRowExpansion(row.id)}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </List>
    </Box>
  );

  // Card por defecto para móvil
  const DefaultMobileCard = ({ row, columns, isExpanded, onToggle }) => {
    const primaryColumn = columns.find(col => col.primary) || columns[0];
    const secondaryColumns = columns.filter(col => !col.primary && col.field !== 'actions');
    const actionsColumn = columns.find(col => col.field === 'actions');

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {primaryColumn.renderCell ? 
                primaryColumn.renderCell({ row, value: row[primaryColumn.field] }) :
                row[primaryColumn.field]
              }
            </Typography>
            
            {/* Mostrar 1-2 campos importantes siempre */}
            {secondaryColumns.slice(0, 2).map((column) => (
              <Typography key={column.field} variant="body2" color="textSecondary">
                {column.headerName}: {
                  column.renderCell ? 
                    column.renderCell({ row, value: row[column.field] }) :
                    row[column.field]
                }
              </Typography>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {actionsColumn && (
              <Box>
                {actionsColumn.renderCell({ row })}
              </Box>
            )}
            
            {secondaryColumns.length > 2 && (
              <IconButton size="small" onClick={onToggle}>
                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Campos adicionales colapsables */}
        {secondaryColumns.length > 2 && (
          <Collapse in={isExpanded}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ mt: 2 }}>
              {secondaryColumns.slice(2).map((column) => (
                <Box key={column.field} sx={{ mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    {column.headerName}
                  </Typography>
                  <Typography variant="body2">
                    {column.renderCell ? 
                      column.renderCell({ row, value: row[column.field] }) :
                      row[column.field]
                    }
                  </Typography>
                </Box>
              ))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  // Renderizado desktop con DataGrid
  if (isMobile) {
    return <MobileCardView />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        autoHeight
        disableSelectionOnClick
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          }
        }}
        {...gridProps}
      />
    </Box>
  );
};

export default ResponsiveDataGrid;