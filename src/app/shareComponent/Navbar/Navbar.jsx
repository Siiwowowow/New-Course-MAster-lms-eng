"use client";

import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Bell,
  LogOut,
  User,
  Settings,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logOut } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Generate random avatar from DiceBear API or use local fallback
  useEffect(() => {
    if (!user?.photoURL) {
      const avatars = ["adventurer", "avataaars", "micah", "bottts", "fun-emoji", "lorelei"];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      const randomSeed = Math.random().toString(36).substring(7);
      const url = `https://api.dicebear.com/7.x/${randomAvatar}/svg?seed=${randomSeed}`;

      const timer = setTimeout(() => {
        setAvatarUrl(url);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const link = (
    <div className="gap-6 flex flex-col lg:flex-row items-start lg:items-center">
      <Link
        href="/"
        className={`relative flex items-center gap-2 font-medium pb-1 transition-all ${
          pathname === "/" ? "text-[#35556e]" : "text-gray-600"
        }`}
      >
        <Home size={18} /> Home
        {pathname === "/" && (
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#35556e] rounded"></span>
        )}
      </Link>

      <Link
        href="/courses"
        className={`relative flex items-center gap-2 font-medium pb-1 transition-all ${
          pathname === "/courses" ? "text-[#35556e]" : "text-gray-600"
        }`}
      >
        <BookOpen size={18} /> Courses
        {pathname === "/courses" && (
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#35556e] rounded"></span>
        )}
      </Link>

      <Link
        href="/dashboard"
        className={`relative flex items-center gap-2 font-medium pb-1 transition-all ${
          pathname === "/dashboard" ? "text-[#35556e]" : "text-gray-600"
        }`}
      >
        <LayoutDashboard size={18} /> Dashboard
        {pathname === "/dashboard" && (
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#35556e] rounded"></span>
        )}
      </Link>
    </div>
  );

  const handleLogout = async () => {
    try {
      await logOut();
      setDropdownOpen(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  useEffect(() => {
  if (!user?.photoURL) {
    // Compute avatar URL outside setState
    const avatars = ["adventurer", "avataaars", "micah", "bottts", "fun-emoji", "lorelei"];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    const randomSeed = Math.random().toString(36).substring(7);
    const url = `https://api.dicebear.com/7.x/${randomAvatar}/svg?seed=${randomSeed}`;

    // Defer state update to next tick
    const timer = setTimeout(() => {
      setAvatarUrl(url);
    }, 0);

    return () => clearTimeout(timer);
  }
}, [user]);

  return (
    // CHANGED: Added sticky container with proper positioning
    <div className="sticky top-0 z-50 w-full">
      {/* CHANGED: Removed sticky from inner div, added shadow directly based on scroll */}
      <div className={`navbar w-full bg-base-100 transition-all duration-300 ${
        scrolled 
          ? "shadow-lg bg-white/95 backdrop-blur-sm border-b border-gray-200" 
          : "bg-base-100"
      }`}>
        {/* LEFT */}
        <div className="navbar-start">
          <div className="dropdown -ml-4 lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {link}
            </ul>
          </div>

          <Link href="/" className="btn btn-ghost text-xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#35556e] to-[#4a8bb8] -ml-6 lg:ml-0">
              CourseMaster
            </span>
          </Link>
          
          <input type="checkbox" defaultChecked className="toggle toggle-xs -ml-3 mt-1.5" />
        </div>

        {/* CENTER */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{link}</ul>
        </div>

        {/* RIGHT */}
        <div className="navbar-end flex gap-2 items-center">
          <button className="btn btn-ghost btn-circle relative hover:bg-gray-100 transition-all border border-gray-100 hover:border-gray-300">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              3
            </span>
          </button>

          {!user ? (
            <>
              <Link href="/login" className="btn btn-sm flex gap-2 items-center hover:shadow transition-all">
                <LogIn size={16} /> Login
              </Link>

              <Link
                href="/signup"
                className="btn btn-sm bg-gradient-to-r from-[#35556e] to-[#4a8bb8] text-white flex gap-2 items-center hover:shadow-lg hover:scale-105 transition-all"
              >
                <UserPlus size={16} /> Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-all border border-gray-100 hover:border-gray-300"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-lg">
                  {user.photoURL ? (
                    <Image 
                      width={36} 
                      height={36} 
                      src={user.photoURL} 
                      alt="User Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : avatarUrl && !avatarError ? (
                    <img 
                      src={avatarUrl} 
                      alt="Random Avatar" 
                      className="w-full h-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${getRandomColor()} text-white font-semibold`}>
                      {getUserInitials()}
                    </div>
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-800">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className="text-xs text-gray-500">Student</span>
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
                    <div className="p-4 bg-gradient-to-r from-[#35556e] to-[#4a8bb8] text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                          {user.photoURL ? (
                            <Image 
                              width={48} 
                              height={48} 
                              src={user.photoURL} 
                              alt="User Avatar" 
                              className="w-full h-full object-cover"
                            />
                          ) : avatarUrl && !avatarError ? (
                            <img 
                              src={avatarUrl} 
                              alt="Random Avatar" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${getRandomColor()} text-white font-semibold text-lg`}>
                              {getUserInitials()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold truncate">
                            {user.displayName || "User"}
                          </h3>
                          <p className="text-sm text-white/90 truncate">
                            {user.email || "student@coursemaster.com"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-[#35556e]" />
                        </div>
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="p-1.5 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </div>
                        <span>Settings</span>
                      </Link>

                      <Link
                        href="/billing"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="p-1.5 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                          <CreditCard className="w-4 h-4 text-green-600" />
                        </div>
                        <span>Billing & Plans</span>
                      </Link>

                      <Link
                        href="/help"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="p-1.5 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                          <HelpCircle className="w-4 h-4 text-yellow-600" />
                        </div>
                        <span>Help & Support</span>
                      </Link>

                      <div className="border-t my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors group"
                      >
                        <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>

                    <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
                      © 2025 CourseMaster. All rights reserved.
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}