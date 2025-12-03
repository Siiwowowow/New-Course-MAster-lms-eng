'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./shareComponent/Navbar/Navbar";
import Footer from "./shareComponent/Footer/Footer";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        {!isDashboard && <Navbar />}
        <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    theme: {
                      primary: "green",
                      secondary: "black",
                    },
                  },
                  error: {
                    duration: 5000,
                  },
                  loading: {
                    duration: Infinity,
                  },
                }}
              />
        {children}
        {!isDashboard && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
