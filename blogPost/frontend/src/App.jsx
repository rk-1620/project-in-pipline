// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider}  from './context/AuthContext';
import axios from 'axios';

//Layout component
import MainLayout from './components/layout/MainLayout';
// import AdminLayout from './components/layout/MainLayout';
// import MainLayout from './components/layout/MainLayout';
// import HomePage from './pages/home/HomePage';
// import BlogFeed from './pages/blog/BlogFeed';
// import BlogPost from './pages/blog/BlogPost';
// import CreatePost from './pages/blog/CreatePost';

//Public Routes
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage'
import BlogList from './pages/blog/BlogList';
import BlogDetailPage from './pages/blog/BlogDetailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Protected User Routes
import DashboardPage from './pages/dashboard/Dashboard';
import CreateBlogPage from './pages/dashboard/CreateBlogPage';
import EditBlogPage from './pages/dashboard/EditBlogPage';
import ProfilePage from './pages/profile/userDetail';
import UserBlogsPage from './pages/dashboard/UserBlogs';

// Admin Routes
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/adminDashboard';
import UserManagementPage from './pages/admin/UserManagement';
import BlogManagementPage from './pages/admin/BlogManagement';


// Auth Components
import ProtectedRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import PublicOnlyRoute from './components/auth/PublicOnlyRoute';

// Error Components
import NotFoundPage from './pages/errors/NotFoundPage';
import UnauthorizedPage from './pages/errors/UnauthorizedPage';


// import EditProfilePage from './pages/profile/EditProfilePage';



// import CreateBlog from './pages/blog/BlogCreate'


function App() {
    const API_URL = 'http://localhost:3000/api/auth'; // Update with your backend URL

    // if (process.env.NODE_ENV === 'development') {
    //   const { initJSErrorLogging } = require('../../../../data-collector/loggers/log-js-errors');
    //   initJSErrorLogging();
    // }
    
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

           {/* Public Routes */}
           <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />
            
            {/* Auth Routes - Only accessible when logged out */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              
            </Route>

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-blogs" element={<UserBlogsPage />} />
              <Route path="/blogs/create" element={<CreateBlogPage />} />
              <Route path="/blogs/edit/:id" element={<EditBlogPage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
            <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/blogs" element={<BlogManagementPage />} />
              </Route>
            </Route>

            {/* Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Public routes */}
          
          {/* <Route path="/" element={<HomePage />} />
          <Route path="/usersName" element={<userName/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blogs/getBlogById/:id" element={<BlogDetailPage />} />
          <Route path="/getAllBlogs" element={<BlogList />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
          {/* Protected routes */}

          {/* <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-blog" element={<CreateBlogPage />} />
            <Route path="/edit-blog/:id" element={<EditBlogPage />} />
          </Route> */}



          {/* <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/create-blog" element={<ProtectedRoute><CreateBlogPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> */}



          {/* Protected Routes - Require Authentication */}
          {/* <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-blog" element={<CreateBlogPage />} /> */}
            
            {/* Profile Related Routes */}
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
            {/* <Route path="/profile/edit" element={<EditProfilePage />} /> */}
            {/* <Route path="/change-password" element={<ChangePasswordPage />} /> */}
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;