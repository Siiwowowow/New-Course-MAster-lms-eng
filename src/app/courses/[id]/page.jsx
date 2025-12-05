"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import PaymentModal from "@/app/component/paymentModal/paymentmodal";
import useAuth from "@/hooks/useAuth";
import { 
  Star, 
  Users, 
  Clock, 
  CheckCircle, 
  BookOpen,
  Award,
  Calendar,
  Tag,
  PlayCircle,
  Download,
  Share2,
  Bookmark,
  Target,
  Trophy,
  Lock,
  Unlock,
  BarChart3
} from "lucide-react";

export default function CourseDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [loadingEnrollment, setLoadingEnrollment] = useState(true);
  const [enrollmentDate, setEnrollmentDate] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!user?.email || !id) {
        setLoadingEnrollment(false);
        return;
      }

      try {
        // Check if user is enrolled in this course
        const response = await axios.get(`/api/users/check-enrollment`, {
          params: {
            email: user.email,
            courseId: id
          }
        });

        if (response.data.success) {
          setEnrolled(response.data.enrolled);
          if (response.data.enrolledAt) {
            setEnrollmentDate(new Date(response.data.enrolledAt));
          }
        }
      } catch (error) {
        console.error('Error checking enrollment:', error);
      } finally {
        setLoadingEnrollment(false);
      }
    };

    if (user && id) {
      checkEnrollmentStatus();
    } else {
      setLoadingEnrollment(false);
    }
  }, [user, id]);

  const isValidImageUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    return url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://");
  };

  const handleEnroll = () => {
    if (authLoading) return;

    if (!user) {
      router.push(`/login?from=${encodeURIComponent(`/courses/${id}`)}&action=enroll`);
      return;
    }

    if (enrolled) {
      router.push(`/courses/${id}/learn`);
      return;
    }

    setShowModal(true);
  };

  const handleContinueLearning = () => {
    router.push(`/courses/${id}/learn`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <BookOpen className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-lg text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-16 h-16 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The course you're looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/courses')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const thumbnail = isValidImageUrl(course.thumbnail) ? course.thumbnail : '/placeholder.png';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Course Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Course Info */}
            <div className="lg:w-2/3">
              <div className="inline-flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Tag className="w-4 h-4" />
                <span className="text-sm font-medium">{course.category || 'Development'}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {course.title || "Untitled Course"}
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-3xl">
                {course.description || "Master new skills with this comprehensive course"}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Rating</p>
                    <p className="font-bold">{course.rating || '4.8'}/5.0</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Students</p>
                    <p className="font-bold">{course.enrolled?.toLocaleString() || '2,500'}+</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Duration</p>
                    <p className="font-bold">{course.duration || '12 hours'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Level</p>
                    <p className="font-bold">{course.level || 'Beginner'}</p>
                  </div>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {course.instructor?.charAt(0) || 'I'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Instructor</p>
                  <p className="font-bold text-lg">{course.instructor || 'Professional Instructor'}</p>
                </div>
              </div>
            </div>

            {/* Right: Enrollment Card */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
                {loadingEnrollment ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600 text-sm">Checking enrollment status...</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">Course Access</h3>
                        {enrolled && (
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 animate-pulse">
                            <CheckCircle size={14} />
                            Enrolled
                          </div>
                        )}
                      </div>

                      <div className="text-center mb-6">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                          {course.price === 0 ? 'Free' : `$${Number(course.price).toFixed(2)}`}
                        </div>
                        {course.originalPrice && (
                          <div className="text-lg text-gray-500 line-through">
                            ${course.originalPrice}
                          </div>
                        )}
                      </div>

                      {/* Enrollment Info */}
                      {enrolled && enrollmentDate && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Enrolled on:</span>
                          </div>
                          <p className="text-green-700 font-medium">
                            {enrollmentDate.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                            {Math.floor((new Date() - enrollmentDate) / (1000 * 60 * 60 * 24))} days ago
                          </p>
                        </div>
                      )}

                      {/* User Status */}
                      {!user && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Lock className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">Login Required</span>
                          </div>
                          <p className="text-yellow-700 text-sm">
                            Please login to enroll in this course
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="space-y-3">
                      {enrolled ? (
                        <button
                          onClick={handleContinueLearning}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        >
                          <PlayCircle size={22} />
                          Continue Learning
                        </button>
                      ) : user ? (
                        <button
                          onClick={handleEnroll}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        >
                          <Unlock size={22} />
                          Enroll Now
                        </button>
                      ) : (
                        <button
                          onClick={() => router.push(`/login?from=${encodeURIComponent(`/courses/${id}`)}`)}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        >
                          <Lock size={22} />
                          Login to Enroll
                        </button>
                      )}

                      {/* Additional Actions */}
                      <div className="flex gap-3">
                        <button className="flex-1 border-2 border-blue-600 text-blue-600 font-medium py-3 px-4 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2">
                          <Bookmark size={18} />
                          Save
                        </button>
                        <button className="flex-1 border-2 border-gray-300 text-gray-600 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2">
                          <Share2 size={18} />
                          Share
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 text-center mt-4">
                        {enrolled ? 'Full access granted • Lifetime access' : '30-day money-back guarantee • Lifetime access'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Course Content */}
          <div className="lg:col-span-2">
            {/* Course Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                About This Course
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-4">
                  {course.longDescription || course.description || 'This comprehensive course covers everything you need to know about this subject. From basic concepts to advanced techniques, you\'ll gain practical skills that you can apply immediately.'}
                </p>
                
                {course.prerequisites && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      {Array.isArray(course.prerequisites) ? (
                        course.prerequisites.map((prereq, index) => (
                          <li key={index}>{prereq}</li>
                        ))
                      ) : (
                        <li>Basic computer knowledge</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Course Modules */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                <span>Course Content</span>
                <span className="text-sm font-normal text-gray-600">5 modules • 45 lessons • 12 hours</span>
              </h2>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`border rounded-xl p-4 transition-all ${
                    enrolled 
                      ? 'border-blue-200 hover:border-blue-300 hover:bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          enrolled 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Module {i + 1}: Fundamentals</h3>
                          <p className="text-sm text-gray-600 mt-1">5 lessons • 45 minutes</p>
                        </div>
                      </div>
                      {enrolled ? (
                        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
                          <PlayCircle size={18} />
                          Start
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Lock size={16} />
                          <span className="text-sm">Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-8">
            {/* Instructor Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Instructor</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {course.instructor?.charAt(0) || 'I'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{course.instructor || 'Professional Instructor'}</h4>
                  <p className="text-sm text-gray-600">Senior Developer & Educator</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                10+ years of experience in software development and teaching. Passionate about helping students succeed.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">4.9</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">50,000+</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-green-500" />
                  <span className="font-medium">15</span>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Course Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-bold text-gray-900">{course.enrolled?.toLocaleString() || '2,500'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-bold text-green-600">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg. Rating</span>
                  <span className="font-bold text-yellow-600">{course.rating || '4.8'}/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Certificate</span>
                  <span className="font-bold text-green-600">Included</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Skills You will Gain</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm rounded-lg border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <PaymentModal
          price={course.price}
          courseId={course._id}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setEnrolled(true);
            setEnrollmentDate(new Date());
            toast.success('Successfully enrolled in course!');
          }}
        />
      )}
    </div>
  );
}