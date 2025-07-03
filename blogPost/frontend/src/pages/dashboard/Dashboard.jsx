// import { useState, memo, useCallback } from 'react';
// import { Tab, Tabs, Box, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import BlogList from '../blog/BlogList';
// import UserBlogs from './UserBlogs';

// // Memoize child components to prevent unnecessary re-renders
// const MemoizedBlogList = memo(BlogList);
// const MemoizedUserBlogs = memo(UserBlogs);

// export default function DashboardPage() {
//   console.log("DashboardPage render");
//   const [tabValue, setTabValue] = useState(0);
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   // Use callback to memoize the handler
//   const handleTabChange = useCallback((event, newValue) => {
//     setTabValue(newValue);
//   }, []);

//   // Memoize the create button to prevent re-renders when user doesn't change
//   const createButton = user ? (
//     <Button 
//       variant="contained" 
//       onClick={() => navigate('/create-blog')}
//     >
//       Create New Blog
//     </Button>
//   ) : null;

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//         <Tabs value={tabValue} onChange={handleTabChange}>
//           <Tab label="All Blogs" />
//           <Tab label="My Blogs" />
//         </Tabs>
//         {createButton}
//       </Box>

//       <Box sx={{ mt: 2 }}>
//         {tabValue === 0 ? <MemoizedBlogList /> : <MemoizedUserBlogs />}
//       </Box>
//     </Box>
//   );
// }


import { useState, memo, useCallback } from 'react';
import { Tab, Tabs, Box, Button, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import BlogList from '../blog/BlogList';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Navbar } from '../../components/common/AppBar';

// 1. Memoize expensive components
const blogList = memo(BlogList);

// 2. Stable component for tabs
const DashboardTabs = memo(({ value, onChange }) => (
  <Tabs value={value} onChange={onChange}>
    <Tab label="All Blogs" disableRipple />
    <Tab label="My Blogs" disableRipple />
  </Tabs>
));

// 3. Create button component
const CreateBlogButton = memo(({ user }) => {
  const navigate = useNavigate();
  return user ? (
    <Button 
      variant="contained" 
      onClick={() => navigate('/create-blog')}
      disableElevation
    >
      Create New Blog
    </Button>
  ) : null;
});

export default function DashboardPage() {
  console.log("DashboardPage render");
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileAnchorEl(null);
  };

  // 4. Stable callback for tab change
  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar/>

      {/* Your existing dashboard content */}
      <Box sx={{ p: 3, flex: 1 }}>
        {/* 5. Memoized header section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <DashboardTabs value={tabValue} onChange={handleTabChange} />
          <CreateBlogButton user={user} />
        </Box>

        {/* 6. Content area with stable components */}
        <Box sx={{ mt: 2 }}>
          {tabValue === 0 ? <BlogList /> : <UserBlogs />}
        </Box>
      </Box>
    </Box>
  );
}