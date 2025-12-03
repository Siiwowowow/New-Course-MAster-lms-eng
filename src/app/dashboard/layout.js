// app/dashboard/layout.jsx
"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import AuthProvider from "@/context/AuthProvider";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-linear-to-br from-blue-50 to-purple-50 transition-all duration-300">

       
        
        <DashboardSidebar open={open} setOpen={setOpen} />

        <main
          className={`flex-1 transition-all duration-300 ${
            open ? "lg:ml-64" : "lg:ml-16"
          } ${isMobile ? "ml-0" : ""}`}
        >
          <div className="p-4 lg:p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}