import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage'
import VisualsPage from './pages/VisualsPage';
import { createContext } from 'react';
import { useEffect } from 'react';
import { lookInSession } from '../../../blogs/frontend/src/common/session';
import Authform from './pages/AuthForm';
import Navbar from './component/navbar';

export const UserContext = createContext({})

function App() {

  const [userAuth, setUserAuth] = useState({ })

  useEffect(()=>{
        const userInSession = lookInSession("user");
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token:null})
    },[])

  return (
    <UserContext.Provider value={{userAuth, setUserAuth}}>
        <Routes>
          <Route path="/" element={<Navbar/>}>
            <Route path="homepage" element={<HomePage/>} />
            <Route path="visuals" element={<VisualsPage/>} />
            <Route path = "signin" element = {<Authform type="sign-in" />}></Route>
            <Route path = "signup" element = {<Authform type="sign-up" />}></Route>
          </Route>
        </Routes>
    </UserContext.Provider>
  )
}

export default App
