import './App.css'
import { Routes, Route, Outlet } from 'react-router-dom';
// Importing lazy and Suspense directly from React
import { lazy, Suspense, useState,createContext, useEffect } from 'react';
import ProfilePage from './pages/ProfilePage';
// lazy(): Dynamically loads the component when it’s first rendered
const HomePage = lazy(() => import('./pages/Homepage'));
const VisualsPage = lazy(() => import('./pages/VisualsPage'));
const AuthForm = lazy(() => import('./pages/AuthForm'));

import { lookInSession } from './common/session';
import { VisualsProvider } from './context/VisualsContext';
import Navbar from './component/navbar';
import Loader from './component/Loader';
import PageNotFound from './pages/404Page';
import Banner from './pages/bannerPage';

export const UserContext = createContext({})

function App() {

  // useState: Holds user's authentication data with default access_token
  const [userAuth, setUserAuth] = useState({ access_token: null });

  useEffect(() => {
    try {
      const userInSession = lookInSession("user");
      if (userInSession) {
        setUserAuth(JSON.parse(userInSession));
      } else {
        setUserAuth({ access_token: null });
      }
    } catch (error) {
      console.error('Invalid session data:', error);
      setUserAuth({ access_token: null });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
  
      {/* Navbar is outside Suspense so it's always visible instantly */}
      <Navbar />

      {/* Suspense wraps Routes to handle lazy-loaded pages */}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Outlet />}>
           <Route index element={<Banner />} />
            <Route path="homepage" element={<HomePage />} />
            <Route
              path="visuals"
              element={
                <VisualsProvider>
                  <VisualsPage />
                </VisualsProvider>
              }
            />
            <Route path="signin" element={<AuthForm type="sign-in" />} />
            <Route path="signup" element={<AuthForm type="sign-up" />} />
            <Route path="user/:id" element={<ProfilePage/>} />
            <Route path="*" element={ <PageNotFound/> } />
          </Route>
        </Routes>
      </Suspense>

    </UserContext.Provider>

  )
}

export default App
