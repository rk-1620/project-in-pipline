import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { UserContext } from "../App";
import { useContext, useState } from "react";
import UserNavigationPanel from "./user-navigation-panel";


const Navbar = () => {
  const { userAuth, userAuth: { access_token, profile_img } } = useContext(UserContext);

  const [userNavPanel, setUserNavPanel] = useState(false);
  const navigate = useNavigate();

  const handleBlur = ()=>{
        setTimeout(()=>{
            setUserNavPanel(false);
        }, 200)
        
    }

  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  return (
    <>
    
    
    <div className="relative flex items-center justify-between p-3 rounded-full bg-white m-2 shadow-md">
      

      <Link to="/" className="w-10 sm:w-14 flex-none">
        <img className="h-8 sm:h-10" src={logo} alt="Logo" />
      </Link>


      <p className="absolute left-4/11 transform -translate-x-1/2 text-sm font-semibold whitespace-nowrap">
        Expense Tracker
      </p>


      {access_token ? (
        <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
          <button className="w-10 h-10 sm:w-12 sm:h-12">
            <img
              src={profile_img}
              alt="User"
              className="w-full h-full object-cover rounded-full border"
            />
          </button>

          {userNavPanel && <UserNavigationPanel />}
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/signup"
            className="w-24 sm:w-32 text-center px-3 py-2 bg-white text-black border rounded-full text-xs sm:text-base capitalize hover:bg-opacity-80"
          >
            Sign Up
          </Link>

          <Link
            to="/signin"
            className="w-24 sm:w-32 text-center px-3 py-2 bg-black text-white rounded-full text-xs sm:text-base capitalize hover:bg-opacity-80"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
    <Outlet />
    </>
  );
};

export default Navbar;
