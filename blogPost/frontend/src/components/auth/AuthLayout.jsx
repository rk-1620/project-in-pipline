import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import '../../App.css';

export default function AuthLayout() {
  return (
    <Box className="auth-layout">
      <CssBaseline />
      <Outlet />
    </Box>
  );
}
