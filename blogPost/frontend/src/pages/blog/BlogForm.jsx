import { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function BlogForm({ 
  initialData = { title: '', content: '' }, 
  onSubmit,
  loading,
  error
}) {
  const [formData, setFormData] = useState(initialData);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(initialData);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("data from handlesubmit of blogform",formData.title);
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        fullWidth
        margin="normal"
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      
      <TextField
        fullWidth
        margin="normal"
        label="Content"
        name="content"
        multiline
        rows={10}
        value={formData.content}
        onChange={handleChange}
        required
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
}