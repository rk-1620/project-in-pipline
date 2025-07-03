import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { TextField, Button, Box, Alert, Typography } from '@mui/material';
import '../../App.css'; // Import global styles

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setError('');
    setLoading(true);
    
    try {
      const { message } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(message || 'Registration successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="form-container">
      <Typography variant="h5" className="form-title">
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} className="form-box">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} required margin="normal" />
        <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required margin="normal" />
        <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required margin="normal" />
        <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required margin="normal" />
        
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Box>
    </Box>
  );
}
