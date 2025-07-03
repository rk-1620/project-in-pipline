import { Outlet } from 'react-router-dom';
import AppBar from '../common/AppBar';
import Footer from '../common/Footer'; // Optional
import { useAuth } from '../../context/AuthContext';

export default function MainLayout() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="main-layout">
      {/* Header/Navigation (AppBar) */}
      <AppBar isAuthenticated={isAuthenticated} user={user} />

      {/* Main Content */}
      <main className="content">
        <Outlet /> {/* Renders child routes (e.g., HomePage, BlogList, etc.) */}
      </main>

      {/* Footer (Optional) */}
      <Footer />
    </div>
  );
}