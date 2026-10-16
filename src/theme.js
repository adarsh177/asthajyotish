import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#3949ab' },
    secondary: { main: '#ef6c00' },
    background: { default: '#eef1f8' },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans Devanagari", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    MuiCard: { defaultProps: { elevation: 1 } },
  },
});

export default theme;
