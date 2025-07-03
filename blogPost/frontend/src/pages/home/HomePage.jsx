// HomePage.jsx
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import blogServices from '../../services/blogService';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import {Navbar} from '../../components/common/AppBar';
import {BlogCard} from '../../components/blog/BlogCard'
import  {FeatureCard} from '../../components/blog/FeatureCard'
import { CircularProgress } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

export default function HomePage() {
  console.log("homepage entered")
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  const theme = useTheme();
  const [publicBlogs, setPublicBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicBlogs = async () => {
      try {
        const blogs = await blogServices.getAllBlogs();
        console.log("blogs at hompage",blogs);
        setPublicBlogs(blogs.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching public blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicBlogs();
  }, []);

  const features = [
    {
      icon: '📝',
      title: 'Easy Writing',
      description: 'Intuitive editor for seamless content creation'
    },
    {
      icon: '🌐',
      title: 'Global Community',
      description: 'Connect with writers and readers worldwide'
    },
    {
      icon: '🔒',
      title: 'Your Space',
      description: 'Full control over your content and privacy'
    }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: theme.palette.background.default,
    }}>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      {console.log("hompage isAuthenticated", isAuthenticated)}
      {/* Hero Section */}
      <Box sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white',
        py: 15,
        textAlign: 'center',
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome to BlogSphere
          </Typography>
          <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4 }}>
            Your gateway to thought-provoking content and community discussions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {!isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    backgroundColor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  Register
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Login
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                }}
              >
                Go to Dashboard
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Featured Blogs Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 600 }}>
          Recent Public Blogs
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography align="center" color="error" sx={{ py: 4 }}>{error}</Typography>
        ) : publicBlogs.length > 0 ? (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 4,
            mt: 4
          }}>
            {publicBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </Box>
        ) : (
          <Typography align="center" sx={{ py: 4 }}>No public blogs available yet</Typography>
        )}
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 600 }}>
          Why Choose BlogSphere?
        </Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 4,
          mt: 6
        }}>
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </Box>
      </Container>

      {/* Call-to-Action Section */}
      <Box sx={{
        backgroundColor: theme.palette.primary.light,
        py: 8,
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Ready to start your blogging journey?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(isAuthenticated ? '/create-blog' : '/register')}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              mt: 3,
              backgroundColor: theme.palette.primary.main,
              '&:hover': { backgroundColor: theme.palette.primary.dark }
            }}
          >
            {isAuthenticated ? 'Create Your First Post' : 'Join Now'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}