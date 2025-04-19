import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "../lib/checkAuth";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authData = await checkAuth();
      setIsAuthenticated(authData.authenticated);
      setUser(authData.userData);
      setLoading(false); 
      // console.log(authData.userData);

      // if (
      //   authData.authenticated !== undefined &&
      //   authData.authenticated !== null
      // ) {
      //   localStorage.setItem(
      //     "isAuthenticated",
      //     JSON.stringify(authData.authenticated)
      //   );
      // }

      if (
        authData.authenticated &&
        (location.pathname === "/login" || location.pathname === "/signup")
      ) {
        if (authData.userData?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
       else if (!authData.authenticated && location.pathname === "/") {
        navigate("/login", { replace: true });
      }

      // if (
      //   !authData.authenticated &&
      //   location.pathname !== "/login" &&
      //   location.pathname !== "/signup"
      // ) {
      //   navigate("/login", { replace: true });
      // }
    };
    verifyAuth();
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser ,loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
