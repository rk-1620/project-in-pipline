import { Container, Typography, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import AuthLayout from '../../components/auth/AuthLayout';
import '../../App.css' ; // Add this import

export default function LoginPage() {
  
  return (
    <>
     {/* <AuthLayout> */}
      <Container className="login-page-container">
      
        <Typography component="h1" variant="h4" className="login-page-title">
          Login to Your Account
        </Typography>
        
        <LoginForm />
        
        {/* <Grid container className="login-page-links-container"> */}
          {/* <Grid item> */}
            <Link component={RouterLink} to="/register" variant="body2" className="login-page-link">
              Don't have an account? Register
            </Link>
          {/* </Grid> */}
        {/* </Grid> */}
        
        {/* <Grid container className="login-page-links-container"> */}
          {/* <Grid item> */}
            <Link component={RouterLink} to="/forgot-password" variant="body2" className="login-page-link">
              Forgot password?
            </Link>
          {/* </Grid> */}
        {/* </Grid> */}
      </Container>
      
     {/* </AuthLayout> */}
     </>
  );
}