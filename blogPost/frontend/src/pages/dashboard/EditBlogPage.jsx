import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// agar import default hai to curly bracket use nai krte
import useBlogs from '../../hooks/useBlogs';
import BlogForm from '../blog/BlogForm';
import { Container, Typography } from '@mui/material';

export default function EditBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBlogById, updateExistingBlog } = useBlogs();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id);
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, getBlogById]);

  const handleSubmit = async (blogData) => {
    try {
      setSubmitLoading(true);
      setError(null);
      await updateExistingBlog(id, blogData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Blog
      </Typography>
      <BlogForm 
        initialData={blog}
        onSubmit={handleSubmit}
        loading={submitLoading}
        error={error}
      />
    </Container>
  );
}