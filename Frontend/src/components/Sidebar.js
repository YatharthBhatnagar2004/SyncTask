import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Sidebar = ({ highlight }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [userpic, setUserpic] = useState("");
  useEffect(() => {
    setUserpic(user.pic);
  }, [user]);
  console.log(userpic);

  useEffect(() => {
    const userDataCookie = Cookies.get("userData");
    if (userDataCookie) {
      const userData = JSON.parse(userDataCookie);
      setUser(userData);
    } else {
      console.error("No user data found in cookies");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/auth/google/logout",
        {
          withCredentials: true,
        }
      );
      Cookies.remove("userData"); // Remove user data cookie
      window.location.reload();
      console.log(response);

      // Redirect to login page after logout
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="h-full border-r-[2px] border-solid border-[rgb(228,224,138)]">
      <div className="p-4 h-full w-[20vw] flex flex-col">
        <h2 className="text-[40px] font-bold mb-8">Menu</h2>
        <ul className="space-y-4 h-full relative">
          <Link
            to="/"
            className={`flex ${highlight === 1 ? `bg-[rgba(91,99,255,0.25)]` : ``} items-center p-2 text-lg font-medium hover:text-white text-gray-700 cursor-pointer hover:bg-[rgb(91,98,255)] rounded-lg`}
          >
            Tasks
          </Link>
          <Link
            to="/calender"
            className={`flex ${highlight === 2 ? `bg-[rgba(91,99,255,0.25)]` : ``} items-center p-2 text-lg font-medium hover:text-white text-gray-700 cursor-pointer hover:bg-[rgb(91,98,255)] rounded-lg`}
          >
            Calendar
          </Link>
          <li
            onClick={handleLogout}
            className="flex absolute bottom-8 w-full items-baseline p-2 text-lg font-medium hover:text-white text-gray-700 cursor-pointer hover:bg-[rgb(91,98,255)] rounded-lg"
          >
            Logout
            {/* <img
              src={
                userpic ||
                `https://lh3.googleusercontent.com/a/ACg8ocLgtcm1Ss4yMkvbVUnZzfD0ZPJdkr6SeNlhP2d3t65f9k1skOR4uQ=s96-c`
              }
              alt="User profile"
              className="ml-2 w-5 h-5 rounded-full"
            /> */}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
