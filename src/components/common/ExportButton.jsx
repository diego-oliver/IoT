import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  FileDownload,
  PictureAsPdf,
  TableChart,
  Description,
} from '@mui/icons-material';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';

const ExportButton = ({ 
  data, 
  filename, 
  title = 'Export Data',
  buttonText = 'Export',
  variant = 'outlined',
  size = 'medium',
  ...props 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const exportFilename = filename || `export-${new Date().toISOString().split('T')[0]}`;

    switch (format) {
      case 'csv':
        exportToCSV(data, exportFilename);
        break;
      case 'excel':
        exportToExcel(data, exportFilename);
        break;
      case 'pdf':
        exportToPDF(data, exportFilename, title);
        break;
      default:
        console.error('Unsupported export format:', format);
    }

    handleClose();
  };

  const exportOptions = [
    {
      format: 'csv',
      label: 'Export as CSV',
      icon: <Description />,
    },
    {
      format: 'excel',
      label: 'Export as Excel',
      icon: <TableChart />,
    },
    {
      format: 'pdf',
      label: 'Export as PDF',
      icon: <PictureAsPdf />,
    },
  ];

  return (
    <>
      <Button
        variant={variant}
        size={size}
        startIcon={<FileDownload />}
        onClick={handleClick}
        disabled={!data || data.length === 0}
        {...props}
      >
        {buttonText}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {exportOptions.map((option) => (
          <MenuItem
            key={option.format}
            onClick={() => handleExport(option.format)}
          >
            <ListItemIcon>
              {option.icon}
            </ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ExportButton;