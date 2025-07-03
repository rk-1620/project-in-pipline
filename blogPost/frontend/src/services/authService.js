// import axios from 'axios';
// import { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { useAuth } from '../hooks/useAuth';
// const jwtDecode = (await import('jwt-decode')).jwtDecode;
// // const jwt_decode = require('jwt-decode');

// const API_URL = 'http://localhost:3000/api/auth'; // Update with your backend URL
// const user_API = 'http://localhost:3000/api'; 
// // const navigate = useNavigate();
// // const { isAuthenticated } = useContext(AuthContext);

// // const parseJwt = (token) => {
// //   try {
// //     // Split the token into parts and decode the Base64 payload
// //     const base64Url = token.split('.')[1];
// //     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
// //     const payload = JSON.parse(atob(base64));
// //     return payload;
// //   } catch (error) {
// //     console.error('Error decoding token:', error);
// //     return null;
// //   }
// // };

// const register = async (userData) => {
//   const response = await axios.post(`${API_URL}/register`, userData);
//   if (response.data.token) {
//     localStorage.setItem('token', response.data.token);
//     // localStorage.setItem('user', response.data.user);
//     localStorage.setItem('email', response.data.email);
//   }
//   return response.data;
// };

// const login = async (userData) => {
//   const response = await axios.post(`${API_URL}/login`, userData);
//   if (response.data.token) {
//     localStorage.setItem('token', response.data.token);
//     // localStorage.setItem('user', JSON.stringify(response.data.user));
//     // localStorage.setItem('email', response.data.email);

//   }
//   return response.data;
// };

// // const login = async (userData) => {
// //   console.log('authservice Login userData:', userData); // Debugging line
// //   const response = await axios.post(`${API_URL}/login`, userData);
  
// //   if (response.data.token) {
// //     localStorage.setItem('token', response.data.token);
// //     console.log('authservice Login response data:', response.data); // Debugging line

// //     // 🛑 Fix: Ensure `response.data.user.email` exists before storing
// //     if (response.data.user.email) {
// //       localStorage.setItem('email', response.data.email);  // ✅ Fix here
// //     } else {
// //       console.error("Email not found in response data:", response.data);
// //     }
// //   }
  
// //   return response.data;
// // };


// const logout = () => {
  
//   localStorage.removeItem('token');
//   localStorage.removeItem('email');
//   // const { isAuthenticated, setIsAuthenticated } = useAuth();
//   // setIsAuthenticated(false);
//   // delete axios.defaults.headers.common["Authorization"];
//   // navigate('/dashboard');
//   // navigate("/login");
// };
// // console.log('localStorage user:', localStorage.getItem('user'));
// console.log('localStorage email:', localStorage.getItem('email'));
// console.log('localStorage token:', localStorage.getItem('token'));

// // const getCurrentUser = () => {
// //   return localStorage.getItem('email');
// // };
// const getCurrentUser = async (token) => {
//   // const token = localStorage.getItem('token');
//   const userData = jwtDecode(token);
//   console.log("id from get user", userData.id);
//   // const userData = parseJwt(token);
//   const response = await axios.get(`${user_API}/user/details?id=${userData.id}`);
//   return response;
// };
// const forgotPassword =  async (email) => {
//   return http.post('/auth/forgot-password', { email });
// };

// const resetPassword = async (token, newPassword) => {
//   return http.post('/auth/reset-password', { token, newPassword });
// };

// const verifyResetToken =  async (token) => {
//   return http.get(`/auth/verify-reset-token/${token}`);
// };
// const authService = {
//   register,
//   login,
//   logout,
//   getCurrentUser,
//   verifyResetToken,
//   resetPassword,
//   forgotPassword,

// };

// export default authService;