import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../lib/utils";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const menuRef = useRef();
  const toggleRef = useRef();
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      //event.target this means The element that the user clicked on

      // menuRef and toggleRef means agar click isdono ke bahar ho tabhi setIsMenuOpen(false) hoga agar hum sirf menuref likhte hai toh toggle function perform nahi karega .sirf outside click pe he chalega agar hamburger pe click karte handleclickoutside and handleMenuToggle dono ek dusre ko interfare karega

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post(
        "/api/logout",
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        handleSuccess(res.data.message || "User Logged out");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("isAuthenticated");
        console.log(res.data.message);

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.log("logged out error", error.message);
      handleError(error.message);
    }
  };

  // console.log(loggedInUser);
  // console.log(user);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between p-3 mx-auto relative">
        <div>
          <img
            src="https://cdn-icons-png.freepik.com/256/8476/8476658.png?semt=ais_hybrid"
            alt=""
            className="w-16"
          />
        </div>
        <div>
          <div
            ref={toggleRef}
            className="flex flex-col space-y-1 md:hidden"
            onClick={handleMenuToggle}
          >
            <div className="w-8 h-1 bg-white rounded-full"></div>
            <div className="w-8 h-1 bg-white rounded-full"></div>
            <div className="w-8 h-1 bg-white rounded-full"></div>
          </div>
          <ul
            ref={menuRef}
            className={`absolute w-[200px] top-22 right-0 bg-blue-600 text-white p-4 
             rounded-l-lg   rounded-b-lg  transition-all duration-500 ease-in-out flex flex-col gap-3 z-10 origin-right ${
               isMenuOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
             }    md:flex md:static md:scale-100 md:opacity-100 md:transform-none md:flex-row md:bg-transparent md:gap-6 md:text-white md:p-0 md:w-auto   `}
          >
            <li className="cursor-pointer">
              <Link to={"/"}>Home</Link>
            </li>

            {!isAuthenticated ? (
              <>
                <li className="cursor-pointer">
                  <Link to={"/login"}>Login</Link>
                </li>
                <li className="cursor-pointer">
                  <Link to={"/signup"}>SignUp</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={"/about"}>About</Link>
                </li>
                {user?.role === "admin" && (
                  <li>
                    <Link to={"/admin"}>Admin</Link>
                  </li>
                )}
                <li>Hii ({loggedInUser})</li>

                <li className="cursor-pointer">
                  <button onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
