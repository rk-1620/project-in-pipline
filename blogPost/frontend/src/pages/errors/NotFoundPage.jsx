// src/pages/errors/NotFoundPage.jsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="error-page">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn">Return Home</Link>
  </div>
);

export default NotFoundPage;