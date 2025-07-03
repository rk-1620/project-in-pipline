import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Main Footer Links */}
        <div className="footer-section">
          <h4>BlogPost</h4>
          <p>Your go-to platform for sharing ideas and stories</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
            {isAuthenticated && <li><Link to="/dashboard">Dashboard</Link></li>}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Social/Contact Links */}
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BlogPost. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;