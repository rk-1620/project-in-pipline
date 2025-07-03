import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ onLogout }) => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin/dashboard" end>
              <i className="icon-dashboard"></i> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">
              <i className="icon-users"></i> User Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/blogs">
              <i className="icon-blogs"></i> Blog Management
            </NavLink>
          </li>
          <li>
            <button onClick={onLogout} className="logout-btn">
              <i className="icon-logout"></i> Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;