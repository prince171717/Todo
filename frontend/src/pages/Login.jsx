import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { axiosInstance } from "../lib/axios";
import { handleError, handleSuccess } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { checkAuth } from "../lib/checkAuth";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    console.log(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginData;
    if (!email || !password) {
      return handleError("All fields required");
    }

    try {
      const res = await axiosInstance.post("/api/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        handleSuccess(res.data.message);
        localStorage.setItem("loggedInUser", res.data.name);
        localStorage.setItem("isAuthenticated", true);

        setLoginData({ email: "", password: "" });

        if (res.data?.role === "admin") {
          navigate("/admin", { replace: true });
        } else if(res.data?.role === "user") {
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      const messageFromBackend =
        error.response?.data?.message ||
        error.response?.data?.error?.details?.[0]?.message ||
        error.message;
      handleError(messageFromBackend);
      console.log(messageFromBackend);
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="container flex flex-col justify-center items-center bg-[#fff] shadow-[8px_8px_24px_0px_rgba(66,68,90,1)] px-8 py-6 rounded-2xl w-full max-w-[400px] ">
        <h1 className="mb-5">Login</h1>
        <form onSubmit={handleSubmit} className="form flex flex-col gap-2">
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              id=""
              placeholder="Enter your email"
              onChange={handleChange}
              value={loginData.email}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id=""
                placeholder="Enter your password"
                autoFocus
                onChange={handleChange}
                value={loginData.password}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaRegEye className="size-5 text-base-content/40" />
                ) : (
                  <FaRegEyeSlash className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>
          <button className="bg-purple-700 text-white border-none text-[20px] rounded-md p-3 cursor-pointer my-2.5 mx-0">
            Login
          </button>
          <span>
            Don't have an account?
            <Link to={"/signup"} className="text-blue-700">
              {" "}
              SignUp
            </Link>
          </span>
          <span className="flex justify-center">
  <Link to="/forgot-password" className="text-blue-700">Forgot password?</Link>
</span>

        </form>
      </div>
    </div>
  );
};

export default Login;
