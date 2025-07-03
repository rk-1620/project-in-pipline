import { useState, useEffect } from 'react';
import { AdminService } from '../../services/admin/adminService';
import { Link } from 'react-router-dom';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await AdminService.getAllBlogs();
        setBlogs(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      await AdminService.deleteBlog(blogId);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog');
    }
  };

  if (loading) return <div>Loading blogs...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="blog-management">
      <h2>Blog Management</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map(blog => (
            <tr key={blog._id}>
              <td>
                <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
              </td>
              <td>{blog.author?.name || 'Unknown'}</td>
              <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
              <td>
                <button 
                  onClick={() => handleDeleteBlog(blog._id)}
                  className="danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogManagement;