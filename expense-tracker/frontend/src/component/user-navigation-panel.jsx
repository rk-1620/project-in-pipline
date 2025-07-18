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
                <div className="absolute right-0 w-60 bg-white border border-gray-200 rounded-md shadow-md duration-200">

                <Link to={`/user/${username}`} className="block pl-8 pr-4 py-4 hover:bg-gray-100">
                    Profile
                </Link>
                <span className="block border-t border-gray-200 my-2"></span>

                <Link to="/dashboard/blogs" className="block pl-8 pr-4 py-4 hover:bg-gray-100">
                    Dashboard
                </Link>
                <span className="block border-t border-gray-200 my-2"></span>

                {/* <Link to="/settings/edit-profile" className="block pl-8 pr-4 py-4 hover:bg-gray-100">
                    Settings
                </Link>

                <span className="block border-t border-gray-200 my-2"></span> */}

                <button 
                    onClick={signOutUser} 
                    className="w-full text-left pl-8 pr-4 py-4 hover:bg-gray-100 focus:outline-none"
                >
                    <div className="font-semibold text-lg mb-1">Sign Out</div>
                    <div className="text-sm text-gray-500">@{username}</div>
                </button>

                </div>


    )
}

export default UserNavigationPanel;