import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";


const UserNavigationPanel = ()=>{


    const {userAuth:{username}, setUserAuth} = useContext(UserContext)

    const signOutUser = () =>{
        removeFromSession("user");
        setUserAuth({access_token:null})
    }

    return(
                <div className="bg-white absolute right-0 border w-60 w-60 duration-200" >

                    <Link to={`/user/${username}`} className="link pl-8 py-4">
                        Profile
                    </Link>
                    <Link to="/dashboard/blogs" className="link pl-8 py-4">
                        Dashboard
                    </Link>

                     <Link to="/settings/edit-profile" className="link pl-8 py-4">
                        Settings
                    </Link>
                    <span className="absolute border-t border-grey w-[100%]"></span>

                    <button className="text-left p-4 hover:bggrey w-full pl-8 py-4" onClick={signOutUser}>
                        <h1 className="font-bold text-xl mg-1">sign out</h1>
                        <p className="text-dark-grey">@{username}</p>
                    </button>
                </div>

    )
}

export default UserNavigationPanel;