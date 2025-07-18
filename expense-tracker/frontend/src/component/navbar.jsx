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
    
    
        <div className="relative flex items-center justify-between px-4 py-3 sm:px-6 rounded-full bg-white m-2 shadow-md">

        {/* Logo */}
        <Link to="/homepage" className="w-10 sm:w-14 flex-none hover:scale-105 transition-transform duration-200">
          <img className="h-8 sm:h-10" src={logo} alt="Logo" />
        </Link>

        {/* Title Centered */}
        <p className="absolute left-4/9 transform -translate-x-1/2 text-sm sm:text-base font-semibold text-gray-700 whitespace-nowrap">
          Expense Tracker
        </p>

        {/* Auth Buttons / Profile */}
        {access_token ? (
          <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
            <button className="w-10 h-10 sm:w-12 sm:h-12 focus:outline-none">
              <img
                src={profile_img}
                alt="User Profile"
                className="w-full h-full object-cover rounded-full border hover:shadow-md transition-shadow duration-200"
              />
            </button>
            {userNavPanel && <UserNavigationPanel />}
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/signup"
              className="w-20 sm:w-28 px-3 py-2 text-center text-xs sm:text-sm border border-black rounded-full bg-white text-black hover:bg-black hover:text-white transition-all duration-300"
            >
              Sign Up
            </Link>
            <Link
              to="/signin"
              className="w-20 sm:w-28 px-3 py-2 text-center text-xs sm:text-sm rounded-full bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300"
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
