import { Routes,Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext } from "react";
import { lookInSession } from "./common/session";
import { useState, useEffect } from "react";
import Editor from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";

export const UserContext = createContext({})

const App = () => {

    const [userAuth, setUserAuth] = useState({ });

    useEffect(()=>{
        let userInSession = lookInSession("user");
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token:null})
    },[])
    return (
        <UserContext.Provider value = {{userAuth, setUserAuth}}>
            <Routes>
                <Route path="/editor" element={<Editor/>} />
                <Route path="/editor/:blog_id" element={<Editor/>} />
                <Route path="/" element={<Navbar/>} >
                    <Route index element={<HomePage/>}></Route>
                    <Route path="signin" element={<UserAuthForm type="sign-in"/>} />
                    <Route path="signup" element={<UserAuthForm type="sign-up"/>} />
                    <Route path = "search/:query" element={ <SearchPage/>} />
                    <Route path="user/:id" element={<ProfilePage/>} />
                    <Route path="blog/:blog_id" element = {<BlogPage/>}></Route>
                    <Route path="*" element={ <PageNotFound/> } />
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}

export default App;