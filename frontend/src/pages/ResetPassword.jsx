// pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../lib/utils";
import { axiosInstance } from "../lib/axios";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword)
      return handleError("All fields required");
    if (password !== confirmPassword)
      return handleError("Passwords do not match");

    try {
      const res = await axiosInstance.post(`/api/reset-password/${token}`, {
        password,
      });

      if (res.status === 200) {
        handleSuccess(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      handleError(msg);
    }
  };

  const handleToggleVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="container flex flex-col justify-center items-center bg-[#fff] shadow-[8px_8px_24px_0px_rgba(66,68,90,1)] px-8 py-6 rounded-2xl w-full max-w-[400px] ">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <form
          onSubmit={handleSubmit}
          className="form flex flex-col gap-2"
        >
          <div>
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                type={showPassword.password ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full mb-3"
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
                type={showPassword.confirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered w-full mb-4"
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
          <button
            type="submit"
            className="bg-purple-700 text-white py-2 px-4 rounded w-full"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
