import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 my-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
