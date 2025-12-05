// components/dashBoardSlider/DashboardSidebar.jsx
"use client";

import Link from "next/link";
import {
  FaBars,
  FaHome,
  FaUsers,
  FaBook,
  FaUser,
  FaChalkboardTeacher,
  FaRegClipboard,
  FaSignOutAlt,
  FaRegCalendarCheck,
  FaCog,
  FaGraduationCap,
  FaChartLine,
  FaTasks,
  FaFileAlt,
  FaCalendarAlt,
  FaCogs,
  FaUserShield,
  FaUserGraduate,
  FaUserTie,
  FaChevronLeft,
  FaChevronRight,
  FaPlusCircle,
  FaClipboardList,
  FaPen,
  FaBell,
} from "react-icons/fa";
import { useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useRole from "@/hooks/useRole";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function DashboardSidebar({ open, setOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showRoleUpdate, setShowRoleUpdate] = useState(false);
  const [previousRole, setPreviousRole] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  const { user, logOut, loading: authLoading } = useContext(AuthContext);
  const { role, loading: roleLoading, lastUpdated } = useRole();

  // Helper function to get initials from name
  const getInitials = (name = "") => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate random avatar color based on user's name/email
  const getAvatarColor = (seed = "default") => {
    const colors = [
      "bg-gradient-to-br from-red-400 to-red-600",
      "bg-gradient-to-br from-orange-400 to-orange-600",
      "bg-gradient-to-br from-amber-400 to-amber-600",
      "bg-gradient-to-br from-yellow-400 to-yellow-600",
      "bg-gradient-to-br from-lime-400 to-lime-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-emerald-400 to-emerald-600",
      "bg-gradient-to-br from-teal-400 to-teal-600",
      "bg-gradient-to-br from-cyan-400 to-cyan-600",
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-indigo-400 to-indigo-600",
      "bg-gradient-to-br from-violet-400 to-violet-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600",
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-rose-400 to-rose-600",
    ];
    
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Generate random avatar URL
  const generateRandomAvatar = (name = "", email = "") => {
    const seed = email || name || "default";
    const avatarStyles = [
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=ffd5dc,ffdfbf,d1d4f9,c0aede,b6e3f4`,
      `https://api.dicebear.com/7.x/micah/svg?seed=${seed}&backgroundColor=ffd5dc,ffdfbf,d1d4f9,c0aede,b6e3f4`,
      `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`,
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`,
      `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`,
      `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}`,
      `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`,
    ];
    
    const randomIndex = Math.floor(Math.random() * avatarStyles.length);
    return avatarStyles[randomIndex];
  };

  // Initialize avatar when component mounts or user changes
// In your DashboardSidebar component
useEffect(() => {
  const updateAvatar = async () => {
    if (user) {
      if (user.photoURL && user.photoURL.trim() !== "") {
        // Use setTimeout to defer state update
        setTimeout(() => {
          setUserAvatar(user.photoURL);
          setAvatarLoaded(false);
        }, 0);
      } else {
        const avatar = generateRandomAvatar(user.displayName || user.name, user.email);
        // Use setTimeout to defer state update
        setTimeout(() => {
          setUserAvatar(avatar);
          setAvatarLoaded(false);
        }, 0);
      }
    } else {
      setTimeout(() => {
        setUserAvatar(null);
      }, 0);
    }
  };

  updateAvatar();
}, [user]);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setOpen]);

  // Listen for role update events
  useEffect(() => {
    const handleRoleUpdated = (event) => {
      if (event.detail?.email === user?.email) {
        const newRole = event.detail.role;
        if (role !== newRole) {
          setPreviousRole(role);
          setShowRoleUpdate(true);   
          setTimeout(() => {
            setShowRoleUpdate(false);
          }, 2000);
        }
      }
    };

    window.addEventListener('role-updated', handleRoleUpdated);
    window.addEventListener('admin-role-update', handleRoleUpdated);

    return () => {
      window.removeEventListener('role-updated', handleRoleUpdated);
      window.removeEventListener('admin-role-update', handleRoleUpdated);
    };
  }, [user?.email, role]);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully ✨");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed!");
      console.error(error);
    }
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const colors = {
    light: {
      bg: "bg-gradient-to-b from-blue-50/80 to-purple-50/60 backdrop-blur-sm",
      sidebar: "bg-white/95 backdrop-blur-md",
      text: "text-gray-800",
      textLight: "text-gray-600",
      border: "border-blue-100",
      hover: "hover:bg-blue-50/80",
      active: "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg",
      shadow: "shadow-xl",
    },
    dark: {
      bg: "bg-gradient-to-b from-gray-900 to-blue-900/20",
      sidebar: "bg-gray-800/95 backdrop-blur-md",
      text: "text-gray-100",
      textLight: "text-gray-300",
      border: "border-gray-700",
      hover: "hover:bg-gray-700/80",
      active: "bg-linear-to-r from-blue-600 to-purple-700 text-white shadow-lg",
      shadow: "shadow-2xl",
    },
  };

  const currentTheme = colors.light;

  const roleConfig = {
    admin: {
      title: "Admin Portal",
      icon: <FaUserShield className="text-red-600 text-sm" />,
      color: "from-red-500 to-pink-600",
      badgeColor: "bg-red-100 text-red-700 border-red-200",
      dotColor: "bg-red-500",
    },
    teacher: {
      title: "Teacher Portal",
      icon: <FaUserTie className="text-green-600 text-sm" />,
      color: "from-green-500 to-emerald-600",
      badgeColor: "bg-green-100 text-green-700 border-green-200",
      dotColor: "bg-green-500",
    },
    student: {
      title: "Student Portal",
      icon: <FaUserGraduate className="text-blue-600 text-sm" />,
      color: "from-blue-500 to-purple-600",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
      dotColor: "bg-blue-500",
    },
    user: {
      title: "Dashboard",
      icon: <FaUser className="text-gray-600 text-sm" />,
      color: "from-gray-500 to-gray-700",
      badgeColor: "bg-gray-100 text-gray-700 border-gray-200",
      dotColor: "bg-gray-500",
    },
  };

  const currentConfig = roleConfig[role] || roleConfig.user;

  const linksConfig = {
    admin: [
     { href: "/", label: "Home", icon: <FaHome /> },
      { href: "/dashboard/admin/createCourse", label: "Create Course", icon: <FaPlusCircle /> },
      { href: "/dashboard/admin/all-courses", label: "All Courses", icon: <FaBook /> },
      { href: "/dashboard/admin/batches", label: "Manage Batches", icon: <FaCalendarAlt /> },
      { href: "/dashboard/admin/enrollments", label: "Enrollment Management", icon: <FaUserGraduate /> },
      
    ],
    teacher: [
      { href: "/", label: "Home", icon: <FaHome /> },
      // { href: "/dashboard/teacher/overview", label: "Dashboard", icon: <FaChartLine /> },
      { href: "/dashboard/teacher/createCourse", label: "Create Course", icon: <FaPlusCircle /> },
      { href: "/dashboard/teacher/myCreateCourses", label: "My Create Courses", icon: <FaBook /> },
      { href: "/dashboard/teacher/create-exam", label: "Create Exam and", icon: <FaPen /> },
      { href: "/dashboard/teacher/exams", label: "Exams", icon: <FaClipboardList /> },
      { href: "/dashboard/teacher/assignments", label: "Create Assignments", icon: <FaTasks /> },
      { href: "/dashboard/teacher/assignment", label: "Assignment", icon: <FaChalkboardTeacher /> },
      { href: "/dashboard/teacher/schedule", label: "Schedule", icon: <FaCalendarAlt /> },
      { href: "/dashboard/teacher/profile", label: "Profile", icon: <FaUser /> },
    ],
    student: [
      { href: "/", label: "Home", icon: <FaHome /> },
      { href: "/dashboard/student/overview", label: "Dashboard", icon: <FaChartLine /> },
      { href: "/dashboard/student/my-courses", label: "My Courses", icon: <FaBook /> },
      { href: "/dashboard/student/classes", label: "Classes", icon: <FaGraduationCap /> },
      { href: "/dashboard/student/attendance", label: "Attendance", icon: <FaRegCalendarCheck /> },
      { href: "/dashboard/student/assignments", label: "Assignments", icon: <FaTasks /> },
      { href: "/dashboard/student/grades", label: "Grades", icon: <FaFileAlt /> },
      { href: "/dashboard/student/schedule", label: "Schedule", icon: <FaCalendarAlt /> },
      { href: "/dashboard/student/profile", label: "Profile", icon: <FaUser /> },
    ],
    user: [
      { href: "/", label: "Home", icon: <FaHome /> },
      { href: "/dashboard/user/overview", label: "Overview", icon: <FaChartLine /> },
      { href: "/dashboard/user/profile", label: "Profile", icon: <FaUser /> },
      { href: "/dashboard/user/enroll", label: "Enroll", icon: <FaBook /> },
      { href: "/dashboard/user/progress", label: "Progress", icon: <FaRegClipboard /> },
      { href: "/dashboard/user/settings", label: "Settings", icon: <FaCog /> },
    ],
  };

  const userLinks = linksConfig[role] || linksConfig.user;

  if (authLoading || roleLoading) {
    return (
      <div
        className={`${currentTheme.bg} h-screen transition-all duration-500 ${
          open ? "w-64" : "w-16"
        } flex flex-col items-center justify-center border-r ${currentTheme.border} ${currentTheme.shadow}`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-3 text-gray-600 text-xs font-medium">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`${currentTheme.bg} h-screen transition-all duration-500 ${
          open ? "w-64" : "w-16"
        } flex flex-col border-r ${currentTheme.border} ${currentTheme.shadow}`}
      >
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-xs text-center font-medium">
            Please sign in
          </p>
        </div>
      </div>
    );
  }

  const displayName = user.displayName || user.name || "User";
  const initials = getInitials(displayName);
  const avatarColor = getAvatarColor(displayName + user.email);

  return (
    <>
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Role Update Notification */}
      {showRoleUpdate && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <FaBell className="animate-pulse" />
            <div>
              <p className="font-semibold text-sm">Role Updated!</p>
              <p className="text-xs opacity-90">
                From {previousRole} to {role}
              </p>
            </div>
            <button
              onClick={() => setShowRoleUpdate(false)}
              className="ml-4 text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div
        className={`fixed top-0 left-0 ${currentTheme.sidebar} h-screen flex flex-col transition-all duration-500 z-40 ${
          open ? "w-64" : "w-16"
        } ${isMobile && !open ? "-translate-x-full" : "translate-x-0"} border-r ${
          currentTheme.border
        } ${currentTheme.shadow}`}
      >
        <div className="p-4 border-b border-blue-100/50">
          <div
            className={`flex items-center ${
              open ? "justify-between" : "justify-center"
            } transition-all duration-300`}
          >
            {open ? (
              <>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl bg-linear-to-r ${currentConfig.color} flex items-center justify-center shadow-md`}>
                    {currentConfig.icon}
                  </div>
                  <div>
                    <h1 className="text-sm font-bold text-gray-800 leading-tight">
                      {currentConfig.title}
                    </h1>
                    <p className="text-[10px] text-gray-500 font-medium leading-tight">
                      Welcome, {displayName.split(' ')[0]}!
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
                >
                  <FaChevronLeft className="w-3 h-3 text-gray-500 group-hover:text-blue-600 transition-colors" />
                </button>
              </>
            ) : (
              <>
                <div
                  className={`w-8 h-8 rounded-xl bg-linear-to-r ${currentConfig.color} flex items-center justify-center shadow-md cursor-pointer`}
                  onClick={toggleSidebar}
                >
                  {currentConfig.icon}
                </div>

                <button
                  onClick={toggleSidebar}
                  className="absolute -right-2 top-6 p-1 bg-white border border-blue-100 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
                >
                  <FaChevronRight className="w-2 h-2 text-blue-600" />
                </button>
              </>
            )}
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {userLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? `${currentTheme.active} transform scale-[1.02] shadow-md`
                    : `${currentTheme.text} ${currentTheme.hover} hover:scale-[1.02]`
                } ${!open ? "justify-center" : ""}`}
                onClick={() => isMobile && setOpen(false)}
              >
                <span
                  className={`text-base shrink-0 transition-transform duration-300 ${
                    isActive
                      ? "text-white transform scale-105"
                      : "text-gray-500 group-hover:text-blue-600"
                  }`}
                >
                  {link.icon}
                </span>

                {open && <span className="font-medium text-xs flex-1">{link.label}</span>}

                {isActive && open && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-blue-100/50 space-y-2">
          <div
            className={`flex items-center transition-all duration-300 ${
              open ? "gap-2 justify-start" : "justify-center"
            }`}
          >
            <div className="relative shrink-0">
              <div className={`w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden flex items-center justify-center ${avatarColor} ${!userAvatar ? 'animate-pulse' : ''}`}>
                {userAvatar ? (
                  <img
                  width={700}
                  height={300}
                    src={userAvatar}
                    alt={`${displayName} avatar`}
                    className="w-full h-full object-cover"
                    onLoad={() => setAvatarLoaded(true)}
                    onError={(e) => {
                      console.error('Avatar failed to load:', userAvatar);
                      e.target.style.display = 'none';
                      setAvatarLoaded(false);
                    }}
                    style={{ display: avatarLoaded ? 'block' : 'none' }}
                  />
                ) : null}
                
                {/* Fallback: Show initials when no avatar or avatar fails */}
                {(userAvatar === null || !avatarLoaded) && (
                  <span className="text-white font-bold text-sm">
                    {initials}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>

            {open && (
              <div className="flex-1 min-w-0">
                <div>
                  <p className="font-semibold text-gray-800 text-sm truncate leading-tight">
                    {displayName}
                  </p>
                  <div className="mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize flex items-center gap-1 ${currentConfig.badgeColor} border inline-flex`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${currentConfig.dotColor}`}></span>
                      {role}
                    </span>
                  </div>
                </div>
                {lastUpdated && open && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <p className="text-[9px] text-gray-500">
                      Updated: {new Date(lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Only Logout Button */}
          <div
            className={`flex ${open ? "flex-row" : "flex-col items-center"}`}
          >
            <button
              onClick={handleLogout}
              className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                open ? "flex-1" : "w-10 h-10"
              } bg-linear-to-r from-red-500/10 to-pink-500/10 text-red-600 hover:from-red-500/20 hover:to-pink-500/20 hover:text-red-700 border border-red-200/50 hover:border-red-300/50`}
            >
              <FaSignOutAlt className="w-4 h-4" />
              {open && <span className="ml-2 text-xs font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {isMobile && !open && (
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 z-50 p-2 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group"
        >
          <FaBars className="w-4 h-4 transition-transform group-hover:rotate-90" />
        </button>
      )}
    </>
  );
}