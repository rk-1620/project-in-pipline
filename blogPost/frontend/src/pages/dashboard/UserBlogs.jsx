import { useEffect } from 'react';
import useBlogs from '../../hooks/useBlogs';
import BlogCard from '../../components/blog/BlogCard';
import { CircularProgress, Alert, Stack } from '@mui/material';

export default function UserBlogs() {
  const { blogs, loading, error, fetchUserBlogs } = useBlogs();

  useEffect(() => {
    fetchUserBlogs();
  }, [fetchUserBlogs]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Stack spacing={2}>
      {blogs.map(blog => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </Stack>
  );
}