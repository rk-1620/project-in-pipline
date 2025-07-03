import { Container, Typography, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import AuthLayout from '../../components/auth/AuthLayout';

export default function RegisterPage() {
  return (
    // <AuthLayout>
    <>
      <Container maxWidth="sm">
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Create New Account
        </Typography>
        
        <RegisterForm />
        
        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid item>
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Login
            </Link>
          </Grid>
        </Grid>
      </Container>
    {/* // </AuthLayout> */}
    </>
  );
}