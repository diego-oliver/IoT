import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const ResponsiveContainer = ({ 
  children, 
  maxWidth = 'lg',
  padding = { xs: 1, sm: 2, md: 3 },
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: maxWidth,
        mx: 'auto',
        px: padding,
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveContainer;