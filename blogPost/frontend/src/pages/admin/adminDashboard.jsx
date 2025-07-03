// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";


// // function AdminDashboard()
// // {
// //     const navigate = useNavigate();
// //     const [users, setUsers] = useState([]);
// //     const [blogs, setBlogs] = useState([]);

// //     const adminToken = localStorage.getItem('adminToken');

// //     useEffect(()=>{
// //         if(!adminToken)
// //         {
// //             navigate("/admin/login")
// //         }

// //         const fetchData = async ()=>{
// //             const config = {headers:{Authorization:`Bearer ${adminToken}`}};
// //             const userRes = await axios.get('/api/admin/users', config);
// //             const blogRes = await axios.get('/api/admin/blogs', config);

// //             setUsers(userRes);
// //             setBlogs(blogRes);

// //         };
        
// //         fetchData();
// //      }, [adminToken]);  

// //      const handleDeleteUser = async (id) => {
// //         if (window.confirm('Delete this user?')) {
// //           await axios.delete(`/api/admin/user/${id}`, {
// //             headers: { Authorization: `Bearer ${adminToken}` },
// //           });
// //           setUsers(users.filter((u) => u._id !== id));
// //         }
// //       };
    
// //       const handleDeleteBlog = async (id) => {
// //         if (window.confirm('Delete this blog?')) {
// //           await axios.delete(`/api/admin/blog/${id}`, {
// //             headers: { Authorization: `Bearer ${adminToken}` },
// //           });
// //           setBlogs(blogs.filter((b) => b._id !== id));
// //         }
// //       };
    
// //       return (
// //         <div>
// //           <h1>Admin Dashboard</h1>
    
// //           <h2>Users</h2>
// //           <ul>
// //             {users.map((user) => (
// //               <li key={user._id}>
// //                 {user.name} - {user.email}
// //                 <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
// //               </li>
// //             ))}
// //           </ul>
    
// //           <h2>Blogs</h2>
// //           <ul>
// //             {blogs.map((blog) => (
// //               <li key={blog._id}>
// //                 {blog.title} by {blog.user?.name}
// //                 <button onClick={() => handleDeleteBlog(blog._id)}>Delete</button>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       );
// // }

// // export default AdminDashboard


// import { useEffect, useState } from 'react';
// import adminService from '../../services/adminService';
// import StatsCard from '../../components/admin/StatsCard';

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalBlogs: 0,
//     activeUsers: 0
//   });

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const data = await adminService.getDashboardStats();
//         setStats(data);
//       } catch (error) {
//         console.error('Error fetching dashboard stats:', error);
//       }
//     };
//     fetchStats();
//   }, []);

//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>
//       <div className="stats-grid">
//         <StatsCard 
//           title="Total Users" 
//           value={stats.totalUsers} 
//           icon="👥"
//           color="blue"
//         />
//         <StatsCard 
//           title="Total Blogs" 
//           value={stats.totalBlogs} 
//           icon="📝"
//           color="green"
//         />
//         <StatsCard 
//           title="Active Users" 
//           value={stats.activeUsers} 
//           icon="🟢"
//           color="orange"
//         />
//       </div>
//     </div>
//   );
// };

// // export default AdminDashboard;


import { useEffect, useState } from 'react';
import { AdminService } from '../../services/admin/adminService';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    blogs: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, blogsRes] = await Promise.all([
          AdminService.getAllUsers(),
          AdminService.getAllBlogs()
        ]);
        
        setStats({
          users: usersRes.data.length,
          blogs: blogsRes.data.length,
          activeUsers: usersRes.data.filter(u => u.isActive).length
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="admin-content">
        <AdminSidebar />
        <main>
          <h1>Admin Dashboard</h1>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.users}</p>
            </div>
            <div className="stat-card">
              <h3>Active Users</h3>
              <p>{stats.activeUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Blogs</h3>
              <p>{stats.blogs}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;