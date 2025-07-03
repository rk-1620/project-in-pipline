// components/BlogCard.jsx
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


export const BlogCard = ({ blog }) => {
  // console.log("all blogs from BlogCard", blog);
  const navigate = useNavigate();
  const {user} = useAuth();
  
  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 6
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          By {blog.name || 'Anonymous'}
        </Typography>
        <Typography variant="body1" paragraph>
          {blog.content.substring(0, 150)}...
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button size="small" onClick={() => navigate(`/blogs/getBlogById/${blog._id}`)}>
          Read More
        </Button>
      </Box>
    </Card>
  );
};