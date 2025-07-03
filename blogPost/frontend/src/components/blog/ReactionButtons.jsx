// src/components/blog/ReactionButtons.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reactToBlog, checkUserReactions } from '../../services/blogService';

export const ReactionButtons = ({ blog }) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState({
    likes: blog.reactions?.likes || [],
    saves: blog.reactions?.saves || []
  });
  const [userReactions, setUserReactions] = useState({
    hasLiked: false,
    hasSaved: false
  });

  useEffect(() => {
    const fetchReactions = async () => {
      if (user) {
        const { data } = await checkUserReactions(blog._id);
        setUserReactions(data);
      }
    };
    fetchReactions();
  }, [blog._id, user]);

  const handleReaction = async (type) => {
    if (!user) return; // Handle guest case
    
    try {
      // Optimistic update
      const newReactions = { ...reactions };
      const userArray = newReactions[`${type}s`];
      const isActive = userReactions[`has${type.charAt(0).toUpperCase() + type.slice(1)}`];
      
      if (isActive) {
        newReactions[`${type}s`] = userArray.filter(id => id !== user._id);
      } else {
        newReactions[`${type}s`] = [...userArray, user._id];
      }
      
      setReactions(newReactions);
      setUserReactions(prev => ({ ...prev, [`has${type.charAt(0).toUpperCase() + type.slice(1)}`]: !isActive }));
      
      await reactToBlog(blog._id, type);
    } catch (err) {
      console.error(`Failed to ${type} blog:`, err);
      // Revert on error
      setReactions({
        likes: blog.reactions?.likes || [],
        saves: blog.reactions?.saves || []
      });
    }
  };

  return (
    <div className="reaction-buttons">
      <button 
        onClick={() => handleReaction('like')}
        className={userReactions.hasLiked ? 'active' : ''}
        aria-label={userReactions.hasLiked ? 'Unlike this post' : 'Like this post'}
      >
        ♥ {reactions.likes.length}
      </button>
      
      <button 
        onClick={() => handleReaction('save')}
        className={userReactions.hasSaved ? 'active' : ''}
        aria-label={userReactions.hasSaved ? 'Unsave this post' : 'Save this post'}
      >
        ⚑ {reactions.saves.length}
      </button>
    </div>
  );
};