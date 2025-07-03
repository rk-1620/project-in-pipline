import { useEffect } from 'react';
import useBlogs from '../../hooks/useBlogs';
import {BlogCard} from '../../components/blog/BlogCard'
import { CircularProgress, Alert, Stack, AppBar } from '@mui/material';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { Navbar } from '../../components/common/AppBar';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';

export default function BlogList() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { blogs, loading, error, fetchBlogs } = useBlogs();
  console.log("blogs from blogList", blogs);
  const theme = useTheme();
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
    {currentPath ==='/getAllBlogs' && (
          <Navbar/>
    )}
    
    <Box sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.background.default,
        }}>
  {/* <Navbar isAuthenticated={isAuthenticated} user={user} /> */}
    <Stack spacing={2}>
      {blogs.map(blog => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </Stack>
    </Box>
    </>
  );
}