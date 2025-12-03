'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'

export default function PrivateRoute({ children, requiredRole }) {
  const { user, dbUser, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (loading) return

    // User not logged in
    if (!user && !dbUser) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`)
      return
    }

    // Role-based access
    if (requiredRole) {
      const userRole = dbUser?.role || 'user'
      if (userRole !== requiredRole && userRole !== 'admin') {
        router.replace('/unauthorized')
        return
      }
    }

    // Delay state update to avoid cascading renders
    const timer = setTimeout(() => setIsAuthorized(true), 0)
    return () => clearTimeout(timer)
  }, [loading, user, dbUser, router, pathname, requiredRole])

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-ring loading-lg"></div>
        <span className="ml-4">{loading ? 'Checking authentication...' : 'Redirecting...'}</span>
      </div>
    )
  }

  return children
}
