import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AllBlogService from '../../services/blogService';
import commentService from '../../services/commentService';
import { Box, Typography, Button, TextField, Alert } from '@mui/material';

export default function BlogDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log("blog details page = ", id);
        const blogData = await AllBlogService.getBlogById(id);
        setBlog(blogData);
        setComments(blogData.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    try {
      setCommentError(null);
      const newComment = await commentService.addComment(id, { text: commentText });
      setComments([newComment, ...comments]);
      setCommentText('');
    } catch (err) {
      setCommentError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!blog) return <div>Blog not found</div>;
  // console.log("blogdetailpage",blog);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        {blog.title}
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        By {blog.name}
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
        {blog.content}
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Comments ({comments.length})
        </Typography>
        
        {user && (
          <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
            {commentError && <Alert severity="error" sx={{ mb: 2 }}>{commentError}</Alert>}
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Add a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ mt: 2 }}
            >
              Post Comment
            </Button>
          </Box>
        )}
        
        {comments.length === 0 ? (
          <Typography>No comments yet</Typography>
        ) : (
          comments.map(comment => (
            <Box key={comment._id} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="subtitle2">
                {comment.user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(comment.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {comment.text}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}