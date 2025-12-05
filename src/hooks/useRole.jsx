"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import useAuth from "./useAuth";

export default function useRole() {
  const { user } = useAuth();
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const roleRef = useRef("user");
  const isFetchingRef = useRef(false);

  const fetchRole = useCallback(async (email) => {
    if (!email || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(`/api/users/role?email=${encodeURIComponent(email)}`, {
        cache: "no-store"
      });
      if (!res.ok) throw new Error(`Failed to fetch role: ${res.status}`);
      const data = await res.json();

      const newRole = data?.role || "user";
      if (roleRef.current !== newRole) {
        roleRef.current = newRole;
        setRole(newRole);
        setLastUpdated(new Date().toISOString());
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching role:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Only fetch once when user.email changes
  useEffect(() => {
    if (user?.email) {
      fetchRole(user.email);
    } else {
      roleRef.current = "user";
      setRole("user");
      setLoading(false);
    }
  }, [user?.email, fetchRole]);

  const refreshRole = useCallback(() => {
    if (user?.email) fetchRole(user.email);
  }, [user?.email, fetchRole]);

  const updateRole = useCallback((newRole) => {
    if (roleRef.current !== newRole) {
      roleRef.current = newRole;
      setRole(newRole);
      setLastUpdated(new Date().toISOString());
    }
  }, []);

  return { role, loading, error, refreshRole, updateRole, lastUpdated };
}
