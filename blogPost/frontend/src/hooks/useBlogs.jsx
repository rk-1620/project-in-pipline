import { useState, useEffect, useCallback } from 'react';
import AllBlogService from '../services/blogService';
import { useAuth } from './useAuth';

export default function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { allDetails } = useAuth();

  // Wrap functions in useCallback to maintain stable references
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AllBlogService.getAllBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed here

  const fetchUserBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AllBlogService.getUserBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewBlog = useCallback(async ( blogData ) => {
    try {
      console.log("blogadat from useBlogs", blogData);
      const newBlog = await AllBlogService.createBlog(blogData, {allDetails} );
      setBlogs(prev => [newBlog, ...prev]);
      return newBlog;
    } catch (err) {
      throw err;
    }
  }, [allDetails]); // Add allDetails as dependency

  // Update useEffect to include fetchBlogs as dependency
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]); // Now stable because of useCallback

  return {
    blogs,
    loading,
    error,
    fetchBlogs,
    fetchUserBlogs,
    createNewBlog,
    updateExistingBlog: useCallback(async (id, blogData) => {
      try {
        const updatedBlog = await AllBlogService.updateBlog(id, blogData);
        setBlogs(prev => prev.map(blog => blog._id === id ? updatedBlog : blog));
        return updatedBlog;
      } catch (err) {
        throw err;
      }
    }, []),
    deleteBlog: useCallback(async (id) => {
      try {
        await AllBlogService.deleteBlog(id);
        setBlogs(prev => prev.filter(blog => blog._id !== id));
      } catch (err) {
        throw err;
      }
    }, [])
  };
}
// Key Improvements:
// useCallback for Stable References:
// Wrapped all functions that are returned from the hook or used in effects with useCallback
// This prevents recreation of functions on every render

// Proper useEffect Dependencies:
// Added fetchBlogs to the dependency array of the main useEffect
// Since fetchBlogs is now memoized with useCallback, it won't cause infinite loops

// Functional State Updates:
// Changed state updates to use functional form (prev => ...) to ensure we're working with latest state
// Prevents potential stale closure issues

// Dependency Management:
// Added allDetails as a dependency to createNewBlog since it's used inside
// Other functions that don't depend on external values have empty dependency arrays

// Why This Works:
// Memoization: useCallback memoizes the functions so they don't change between renders unless their dependencies change
// Dependency Tracking: The effect now properly tracks when it should re-run
// Stable API: The hook returns the same function references unless their dependencies change