import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../lib/utils";
import { axiosInstance } from "../lib/axios";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleToggleVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      return handleError("All fields required");
    }

    try {
      const res = await axiosInstance.post("/api/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const { success, message } = res.data;

      if (success) {
        handleSuccess(message);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
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
        <h1 className="mb-5">SignUp</h1>
        <form onSubmit={handleSubmit} className="form flex flex-col gap-2">
          <div>
            <label htmlFor="name">Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              id=""
              placeholder="Enter your name"
              autoFocus
              value={formData.name}
            />
          </div>

          <div>
            <label htmlFor="email">E-mail</label>

            <input
              onChange={handleChange}
              type="email"
              name="email"
              id=""
              placeholder="Enter your email"
              value={formData.email}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                onChange={handleChange}
                type={showPassword.password ? "text" : "password"}
                name="password"
                id=""
                placeholder="Enter your password"
                autoFocus
                value={formData.password}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => handleToggleVisibility("password")}
              >
                {showPassword.password ? (
                  <FaRegEye className="size-5 text-base-content/40" />
                ) : (
                  <FaRegEyeSlash className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword">confirm-Password</label>
            <div className="relative">
              <input
                onChange={handleChange}
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                id=""
                placeholder="Enter your password again"
                autoFocus
                value={formData.confirmPassword}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => handleToggleVisibility("confirmPassword")}
              >
                {showPassword.confirmPassword ? (
                  <FaRegEye className="size-5 text-base-content/40" />
                ) : (
                  <FaRegEyeSlash className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>
          <button className="bg-purple-700 text-white border-none text-[20px] rounded-md p-3 cursor-pointer my-2.5 mx-0">
            SignUp
          </button>
          <span>
            Already have an account?
            <Link to={"/login"} className="text-blue-700">
              {" "}
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
