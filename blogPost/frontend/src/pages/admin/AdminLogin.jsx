// import { useState } from "react";
// import axios from'axios';

// import {useNavigate} from 'react-router-dom';


// function AdminLogin()
// {
//     const navigate = useNavigate();
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const API_URL = 'http://localhost:3000/api'; // Update with your backend URL
//     const handleSubmit = async (e)=>{
//         e.preventDefault();
//         try{
//             const {data} = await axios.post(`${API_URL}/admin/login`, {username, password});
//             localStorage.setItem('adminToken', data.token);
//             navigate('/admin/dashboard');
//         }
//         catch(error)
//         {
//             alert(error.response?.data?.message || 'Login failed');
//         }
//     };

//     return(<div>
//             <h1>Admin Login Page</h1>
//             <form onSubmit={handleSubmit}>
//                 <input 
//                     type = "text"
//                     placeholder="Admin Username"
//                     value={username}
//                     onChange={(e)=>{setUsername(e.target.value)}}
//                 />

//                 <input
//                      type = "password"
//                      placeholder="password"
//                      value={password}
//                      onChange={(e)=>{setPassword(e.target.value)}}
//                 />

//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     );

// }

// export default AdminLogin;




import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminService } from '../../services/admin/adminService';
import { useAuth } from '../../hooks/useAuth';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await AdminService.login(username, password);
      login(response.data.token, { ...response.data.admin, isAdmin: true });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;