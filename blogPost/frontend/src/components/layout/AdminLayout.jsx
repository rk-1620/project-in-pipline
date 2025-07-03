import { Outlet } from 'react-router-dom';
import AdminNavbar from '../admin/AdminNavbar';
import AdminSidebar from '../admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="admin-container">
      <AdminSidebar onLogout={logout} />
      <div className="admin-main">
        <AdminNavbar />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;