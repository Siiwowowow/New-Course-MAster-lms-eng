// hooks/useRole.js
"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import useAuth from "./useAuth";

export default function useRole() {
  const { user } = useAuth();
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const roleRef = useRef("user");
  const lastFetchedRef = useRef(0);
  const pollIntervalRef = useRef(null);
  const emailRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchRole = useCallback(async (email, force = false) => {
    if (!email || isFetchingRef.current) return;

    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchedRef.current;
    
    if (!force && timeSinceLastFetch < 5000) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    lastFetchedRef.current = now;

    try {
      const timestamp = Date.now();
      const res = await fetch(`/api/users/role?email=${encodeURIComponent(email)}&t=${timestamp}`, {
        cache: 'no-store'
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch role: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        const newRole = data.role || "user";
        
        if (roleRef.current !== newRole) {
          console.log(`Role changed: ${roleRef.current} → ${newRole}`);
          roleRef.current = newRole;
          setRole(newRole);
          setLastUpdated(data.updatedAt || new Date().toISOString());
          
          window.dispatchEvent(new CustomEvent('role-updated', {
            detail: { 
              role: newRole,
              email: email,
              timestamp: new Date().toISOString()
            }
          }));
        }
      } else {
        if (roleRef.current !== "user") {
          roleRef.current = "user";
          setRole("user");
          setLastUpdated(new Date().toISOString());
        }
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching role:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      roleRef.current = "user";
      setRole("user");
      return;
    }

    if (emailRef.current === user.email) return;
    emailRef.current = user.email;

    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    fetchRole(user.email, true);

    pollIntervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchRole(user.email, false);
      }
    }, 15000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user.email) {
        fetchRole(user.email, true);
      }
    };

    const handleFocus = () => {
      fetchRole(user.email, true);
    };

    const handleRoleUpdateEvent = (event) => {
      if (event.detail?.email === user.email && event.detail?.role) {
        if (roleRef.current !== event.detail.role) {
          roleRef.current = event.detail.role;
          setRole(event.detail.role);
          setLastUpdated(event.detail.timestamp || new Date().toISOString());
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('role-updated', handleRoleUpdateEvent);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('role-updated', handleRoleUpdateEvent);
    };
  }, [user?.email, fetchRole]);

  const refreshRole = useCallback(() => {
    if (user?.email) {
      fetchRole(user.email, true);
    }
  }, [user?.email, fetchRole]);

  const updateRole = useCallback((newRole) => {
    if (roleRef.current !== newRole) {
      roleRef.current = newRole;
      setRole(newRole);
      setLastUpdated(new Date().toISOString());
      
      window.dispatchEvent(new CustomEvent('role-updated', {
        detail: { 
          role: newRole,
          email: user?.email,
          timestamp: new Date().toISOString()
        }
      }));
    }
  }, [user?.email]);

  return { 
    role, 
    loading, 
    error, 
    refreshRole, 
    updateRole,
    lastUpdated 
  };
}