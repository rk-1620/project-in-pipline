import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogForm from '../blog/BlogForm';
// agar import default hai to curly bracket use nai krte
import useBlogs from '../../hooks/useBlogs';
import AllBlogService from '../../services/blogService' 
import { useAuth } from '../../hooks/useAuth';
// import BlogForm from '../components/BlogForm';
import { Container, Typography } from '@mui/material';

export default function CreateBlogPage() {
  const navigate = useNavigate();
  const { createNewBlog } = useBlogs();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const { allDetails } = useAuth(); // Get user from global state
  const [blogData, setBlogData] = useState({ title: "", content: "" });
  

  const handleSubmit = async (blogData) => {
    try {
      setLoading(true);
      setError(null);
      console.log("blogdata from create blogPage", blogData);
      const newBlog = await createNewBlog(blogData);
      navigate('/dashboard');
    } catch (err) {
      console.log("error in create blogpage");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Blog
      </Typography>
      <BlogForm 
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </Container>
  );
}