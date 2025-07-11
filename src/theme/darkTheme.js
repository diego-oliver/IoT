import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#42a5f5',
      light: '#80d6ff',
      dark: '#0077c2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#26a69a',
      light: '#64d8cb',
      dark: '#00766c',
      contrastText: '#ffffff',
    },
    success: {
      main: '#66bb6a',
      light: '#98ee99',
      dark: '#338a3e',
    },
    warning: {
      main: '#ffa726',
      light: '#ffd95b',
      dark: '#c77800',
    },
    error: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      lineHeight: 1.5,
    },
    body2: {
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
          },
          transition: 'box-shadow 0.2s ease-in-out',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default darkTheme;