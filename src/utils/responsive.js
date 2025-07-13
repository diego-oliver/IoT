import { useTheme, useMediaQuery } from '@mui/material';

// Hook personalizado para breakpoints
export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
};

// Utilidades para estilos responsivos
export const responsiveStyles = {
  // Padding responsivo
  padding: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4
  },
  
  // Margin responsivo
  margin: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4
  },
  
  // Tamaños de fuente responsivos
  fontSize: {
    small: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem'
    },
    medium: {
      xs: '1rem',
      sm: '1.125rem',
      md: '1.25rem'
    },
    large: {
      xs: '1.5rem',
      sm: '2rem',
      md: '2.5rem'
    }
  },
  
  // Grid responsivo
  gridColumns: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4
  },
  
  // Altura de componentes
  height: {
    mobile: 300,
    tablet: 400,
    desktop: 500
  }
};

// Función para obtener valores responsivos
export const getResponsiveValue = (values, breakpoint) => {
  if (typeof values === 'object') {
    return values[breakpoint] || values.xs || Object.values(values)[0];
  }
  return values;
};

// Configuración de DataGrid responsiva
export const getDataGridConfig = (isMobile, isTablet) => ({
  pageSize: isMobile ? 5 : isTablet ? 10 : 25,
  rowsPerPageOptions: isMobile ? [5, 10] : isTablet ? [10, 25] : [10, 25, 50],
  density: isMobile ? 'compact' : 'standard',
  hideFooter: isMobile,
  autoHeight: true,
  disableColumnMenu: isMobile,
  disableColumnFilter: isMobile,
  disableColumnSelector: isMobile,
  disableDensitySelector: isMobile
});

// Configuración de gráficos responsiva
export const getChartConfig = (isMobile, isTablet) => ({
  height: isMobile ? 250 : isTablet ? 350 : 400,
  legend: {
    orient: isMobile ? 'horizontal' : 'vertical',
    bottom: isMobile ? 0 : 'auto',
    left: isMobile ? 'center' : 'left',
    textStyle: {
      fontSize: isMobile ? 10 : 12
    }
  },
  title: {
    textStyle: {
      fontSize: isMobile ? 14 : 16
    }
  },
  tooltip: {
    textStyle: {
      fontSize: isMobile ? 10 : 12
    }
  }
});