// components/FeatureCard.jsx
import { Box, Typography } from '@mui/material';

export const FeatureCard = ({ icon, title, description }) => (
  <Box sx={{
    flex: '1 1 300px',
    maxWidth: '350px',
    p: 3,
    borderRadius: 2,
    backgroundColor: 'background.paper',
    boxShadow: 2,
    textAlign: 'center',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: 4
    }
  }}>
    <Typography variant="h3" sx={{ mb: 2 }}>{icon}</Typography>
    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {description}
    </Typography>
  </Box>
);