'use client'

import { useEffect } from 'react'
import axios from 'axios'

const axiosJWT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  withCredentials: true, // cookies পাঠানোর জন্য
})

const useAxiosJWT = () => {

  useEffect(() => {
    // Response interceptor
    const responseInterceptor = axiosJWT.interceptors.response.use(
      (response) => response,
      (error) => {
        // Token expired বা unauthorized
        if (error.response?.status === 401) {
          console.log('JWT expired or unauthorized. Redirecting to login...')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )

    // Cleanup
    return () => {
      axiosJWT.interceptors.response.eject(responseInterceptor)
    }
  }, [])

  return axiosJWT
}

export default useAxiosJWT
