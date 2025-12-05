"use client";

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { getAuth } from 'firebase/auth';
import { 
  Search, 
  Filter, 
  ChevronUp, 
  ChevronDown,
  X,
  DollarSign,
  Star,
  Calendar,
  Users,
  CheckCircle,
  BookOpen,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';

export default function Courses() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [purchasedCourseIds, setPurchasedCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    instructor: '',
    category: '',
    tags: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 9
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Available categories and tags for filtering
  const categories = ['Web Development', 'Data Science', 'Mobile Development', 'Design', 'Business', 'Marketing', 'AI & ML'];
  const popularTags = ['React', 'JavaScript', 'Python', 'Node.js', 'MongoDB', 'Next.js', 'Tailwind', 'GraphQL'];

  useEffect(() => {
    // Get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user?.email) {
        fetchPurchasedCourses(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchPurchasedCourses = async (email) => {
    try {
      const response = await axios.get(`/api/users/enrolled-courses?email=${email}`);
      if (response.data.success) {
        const purchasedIds = response.data.courses.map(course => course._id);
        setPurchasedCourseIds(purchasedIds);
      }
    } catch (error) {
      console.error('Error fetching purchased courses:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });
      
      const response = await axios.get(`/api/courses?${queryParams}`);
      setCourses(response.data.courses);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value,
      page: key === 'page' ? value : 1
    }));
  };

  const handleSort = (sortBy) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    handleFilterChange('sortBy', sortBy);
    handleFilterChange('sortOrder', newSortOrder);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      instructor: '',
      category: '',
      tags: '',
      minPrice: 0,
      maxPrice: 1000,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 9
    });
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
      if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
        new URL(url, url.startsWith('/') ? 'http://localhost:3000' : undefined);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const isCoursePurchased = (courseId) => {
    return purchasedCourseIds.includes(courseId);
  };

  // Loading skeleton
  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow p-6">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with User Info */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Explore Courses
              </h1>
              <p className="text-gray-600">
                Discover {pagination.totalCourses || 0} courses to advance your skills
              </p>
            </div>
            
            {user && (
              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Welcome back</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                  <div className="ml-4 pl-4 border-l">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{purchasedCourseIds.length} owned</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search courses by title, instructor, or keyword..."
                  className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange('search', '')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <X size={20} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Sort and Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleSort('price')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  filters.sortBy === 'price' 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <DollarSign size={18} />
                Price {filters.sortBy === 'price' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              
              <button
                onClick={() => handleSort('rating')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  filters.sortBy === 'rating' 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Star size={18} />
                Rating {filters.sortBy === 'rating' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
              >
                <Filter size={18} />
                Filters
                {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="border-t border-gray-100 pt-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Instructor Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor
                  </label>
                  <input
                    type="text"
                    placeholder="Search instructor..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    value={filters.instructor}
                    onChange={(e) => handleFilterChange('instructor', e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${filters.minPrice} - ${filters.maxPrice}
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                    <span className="text-sm font-medium">${filters.maxPrice}</span>
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Popular Tags
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    value={filters.tags}
                    onChange={(e) => handleFilterChange('tags', e.target.value)}
                  >
                    <option value="">All Tags</option>
                    {popularTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {courses.length} of {pagination.totalCourses} courses
                </div>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {courses.map((course) => {
            const thumbnail = isValidImageUrl(course.thumbnail) ? course.thumbnail : null;
            const purchased = isCoursePurchased(course._id);
            
            return (
              <div 
                key={course._id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group relative"
              >
                {/* Purchased Badge */}
                {purchased && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                      <CheckCircle size={12} />
                      Purchased
                    </div>
                  </div>
                )}

                {/* Course Thumbnail */}
                <div className="relative h-56 w-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl opacity-20 text-blue-300">📚</div>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Category Badge */}
                  {course.category && (
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-medium">
                      {course.category}
                    </div>
                  )}

                  {/* Level Badge */}
                  <div className="absolute bottom-4 right-4 bg-blue-600/90 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                    {course.level || 'Beginner'}
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 mr-2 group-hover:text-blue-600 transition">
                        {course.title}
                      </h2>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{course.rating || '4.5'}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                      {course.description || 'No description available.'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{course.enrolled || 0} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>{course.duration || '10h'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Instructor:
                      </p>
                      <p className="font-medium text-gray-900">
                        {course.instructor || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">
                        Price
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${course.price === 0 ? 'Free' : course.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {purchased ? (
                    <Link
                      href={`/courses/${course._id}/learn`}
                      className="block w-full text-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <BookOpen size={18} />
                      Continue Learning
                    </Link>
                  ) : (
                    <div className="flex gap-3">
                      <Link
                        href={`/courses/${course._id}`}
                        className="flex-1 text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => {/* Add to cart logic */}}
                        className="p-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition flex items-center justify-center"
                        title="Add to cart"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-2xl transition-all duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition flex items-center gap-2"
              >
                ← Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handleFilterChange('page', pageNum)}
                      className={`w-10 h-10 rounded-lg transition ${
                        pagination.currentPage === pageNum 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition flex items-center gap-2"
              >
                Next →
              </button>
            </div>
            
            <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
              Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalCourses} total courses
            </div>
          </div>
        )}

        {/* No Results */}
        {courses.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              No courses found
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {filters.search 
                ? `No results found for "${filters.search}". Try a different search term.`
                : "Try adjusting your filters or browse our full catalog."}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
              >
                Clear all filters
              </button>
              <Link
                href="/courses/browse"
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition"
              >
                Browse All
              </Link>
            </div>
          </div>
        )}

        {/* User Enrollment Stats */}
        {user && purchasedCourseIds.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Your Learning Progress</h3>
                </div>
                <p className="text-blue-100">
                  You own {purchasedCourseIds.length} courses • Continue your learning journey
                </p>
              </div>
              <Link
                href="/my-courses"
                className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition shadow-lg"
              >
                Go to My Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}