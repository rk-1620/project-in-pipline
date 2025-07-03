import api from '../../src/api'; // Adjust the import path as necessary


const addComment = async (blogId, commentData) => {
  const response = await api.post(`/blogs/${blogId}/comments`, commentData);
  return response.data;
};

const deleteComment = async (blogId, commentId) => {
  const response = await api.delete(`/blogs/${blogId}/comments/${commentId}`);
  return response.data;
};

export default {
  addComment,
  deleteComment,
};