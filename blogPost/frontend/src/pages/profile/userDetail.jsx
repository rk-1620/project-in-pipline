import { Box, Typography, Button, Avatar, Paper, Divider, Chip, Container } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import {Navbar} from '../../components/common/AppBar'; // Adjust the import path as necessary
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { isAuthenticated , allDetails} = useAuth();
  const navigate = useNavigate();
  console.log("userdetails from the profile page", allDetails);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar /> {/* Include your navbar */}
      
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        {!isAuthenticated ? (
          // Not logged in view
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            p: 3
          }}>
            <LockIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Profile Locked
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
              You need to be logged in to view your profile. Please sign in or create an account.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ px: 4 }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ px: 4 }}
              >
                Register
              </Button>
            </Box>
          </Box>
        ) : (
          // Logged in view
          <Box>
            {/* Profile Header */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                alignItems: 'center',
                gap: 4
              }}>
                <Avatar
                  // src={user.avatar}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    fontSize: 48,
                    border: '3px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  {/* {!user.avatar && user.name?.charAt(0).toUpperCase()} */}
                </Avatar>
                
                <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h3" component="h1" gutterBottom>
                    {/* {user.name} */}
                  </Typography>
                  
                  {(
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {/* {user.bio}/ */}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => navigate('/profile/edit')}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Account Details */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Account Information
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 3
              }}>
                <DetailItem label="Email" value={allDetails.email} />
                <DetailItem label="Account Type" value={"user.role "|| 'Standard'} />
                <DetailItem label="Member Since" value={new Date(allDetails.createdAt).toLocaleDateString()} />
                <DetailItem label="Last Login" value={"user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'"} />
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/change-password')}
                >
                  Change Password
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => navigate('/logout')}
                >
                  Logout
                </Button>
              </Box>
            </Paper>

            {/* User Statistics */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Your Activity
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                gap: 3,
                textAlign: 'center'
              }}>
                <StatItem value="24" label="Blogs" />
                <StatItem value="128" label="Comments" />
                <StatItem value="1.2K" label="Views" />
                <StatItem value="98" label="Likes" />
              </Box>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
}

// Reusable component for detail items
function DetailItem({ label, value }) {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  );
}

// Reusable component for statistics
function StatItem({ value, label }) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}