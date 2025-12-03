"use client";

import { AuthContext } from "@/context/AuthContext";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";

export default function SocialLogin() {
  const { signInWithGoogle } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Sign in with Google
      const result = await signInWithGoogle();
      const user = result.user;

      // 2. Prepare user data for MongoDB
      const userData = {
        name: user.displayName,
        email: user.email,
        password: "google_login_hashed_" + Math.random().toString(36).slice(2),
        role: "user",
        avatar: user.photoURL || "",
        bio: "",
        socialLogin: true,
        lastLogin: new Date().toISOString(),
      };

      // 3. Create or update user in MongoDB
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      // 4. Update last login time explicitly
      try {
        const lastLoginRes = await fetch("/api/users/last-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        const lastLoginData = await lastLoginRes.json();
        if (lastLoginData.success) {
          console.log("Last login updated:", lastLoginData.lastLogin);
        }
      } catch (loginTimeError) {
        console.warn("Failed to update last login time:", loginTimeError);
        // Continue anyway
      }

      // 5. Show appropriate message
      if (res.status === 400 && data.message === "User already exists") {
        toast.success(`Welcome back ${user.displayName}! 🎉`);
      } else if (res.ok) {
        toast.success(`Welcome ${user.displayName}! 🎉`);
        console.log("User saved/updated:", data);
      } else {
        throw new Error(data.message || "Database error");
      }

      // 6. Redirect after success
      setTimeout(() => router.push("/"), 1000);

    } catch (err) {
      console.error("Google login error:", err);
      setError(err.message || "Something went wrong");
      
      // Handle specific error messages
      if (err.code === 'auth/popup-closed-by-user') {
        toast.error("Login cancelled. Please try again.");
      } else if (err.code === 'auth/popup-blocked') {
        toast.error("Popup blocked! Please allow popups for this site.");
      } else {
        toast.error(err.message || "Login failed! Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}
      
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md hover:border-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <FaGoogle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
            <span>Continue with Google</span>
          </>
        )}
      </button>
    </div>
  );
}