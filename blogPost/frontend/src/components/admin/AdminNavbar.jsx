import { useAuth } from '../../context/AuthContext';

const AdminNavbar = () => {
  const { user } = useAuth();

  return (
    <header className="admin-navbar">
      <div className="navbar-content">
        <div className="user-info">
          <span>Welcome, Admin</span>
          <span className="user-email">{user?.email}</span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;