import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { handleError, handleSuccess } from "../lib/utils";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return handleError("Email is required");

    try {
      const res = await axiosInstance.post("/api/forgot-password", { email });
      console.log(res);
      if (res.status === 200) {
        handleSuccess(res.data.message);
        setEmail("");
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      handleError(message);
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="container flex  justify-center items-center bg-[#fff] shadow-[8px_8px_24px_0px_rgba(66,68,90,1)] px-8 py-6 rounded-2xl w-full max-w-[400px]">
        <h1 className="mb-5">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="form flex flex-col gap-2">
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <button className="bg-purple-700 text-white border-none text-[20px] rounded-md p-3 cursor-pointer my-2.5 mx-0">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
