'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import {
  Play,
  Pause,
  Clock,
  Star,
  Users,
  Award,
  Bookmark,
  Share2,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  FileText,
  ListChecks,
  ArrowLeft,
  ArrowRight,
  Youtube,
  ExternalLink,
  Loader2,
  User,
  CheckCircle,
  XCircle,
  BarChart3,
  Home,
  Lock,
  Unlock,
  Target,
  TrendingUp,
  Calendar,
  Download,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  BookOpen,
  Video,
  File
} from 'lucide-react';
import axios from 'axios';
import { auth } from '@/lib/firebase.config';

// Progress Bar Component
function ProgressBar({ progress, label, size = 'md', showPercentage = true }) {
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-2.5' : 'h-2';
  
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 font-medium">{label}</span>
          {showPercentage && (
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          )}
        </div>
      )}
      <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
        <div 
          className={`h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out ${
            size === 'lg' ? 'shadow-lg shadow-blue-500/30' : ''
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

// Course Module Component (Collapsible like 10 Minute School)
function CourseModule({ 
  module, 
  index, 
  activeClass, 
  userProgress, 
  onSelectClass,
  isExpanded,
  onToggle 
}) {
  const completedClasses = module.classes?.filter((_, i) => 
    userProgress[module.startIndex + i]?.completed
  ).length || 0;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white">
      {/* Module Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">মডিউল {index + 1}: {module.title}</h3>
            <p className="text-sm text-gray-600">{module.classes?.length || 0} টি লেসন • {completedClasses} সম্পূর্ণ</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Module Content (Collapsible) */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {module.classes?.map((cls, classIndex) => {
            const globalIndex = module.startIndex + classIndex;
            const isActive = globalIndex === activeClass;
            const isCompleted = userProgress[globalIndex]?.completed || false;
            const isLocked = module.locked && !isCompleted;
            
            return (
              <button
                key={globalIndex}
                onClick={() => !isLocked && onSelectClass(globalIndex)}
                disabled={isLocked}
                className={`w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 transition-all ${
                  isActive
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                } ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-100 text-green-600'
                      : isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                        {cls.title}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                          Now Playing
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {cls.duration}
                      </span>
                      {cls.resources && cls.resources > 0 && (
                        <span className="flex items-center gap-1">
                          <File className="w-3 h-3" />
                          {cls.resources} রিসোর্স
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Next Button Component
function NextButton({ 
  onClick, 
  disabled, 
  isLastClass, 
  className = "",
  label = "পরবর্তী লেসন" 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
        disabled
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : isLastClass
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25 hover:scale-[1.02]'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]'
      } ${className}`}
    >
      {isLastClass ? (
        <>
          <CheckCircle className="w-5 h-5" />
          <span>কোর্স সম্পূর্ণ করুন</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
}

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend > 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}

export default function LearnPage() {
  const params = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeClass, setActiveClass] = useState(0);
  const [progressData, setProgressData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState('');
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [expandedModules, setExpandedModules] = useState([0]); // First module expanded by default
  const [showMobileCurriculum, setShowMobileCurriculum] = useState(false);

  // Firebase user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  useEffect(() => {
    if (course && user) {
      fetchProgressData();
    }
  }, [course, user]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/courses/${params.id}`);
      setCourse(res.data);
      
      const initialProgress = {};
      if (res.data.classes) {
        res.data.classes.forEach((cls, index) => {
          initialProgress[index] = {
            completed: false,
            progress: 0,
            lastWatched: null
          };
        });
      }
      setUserProgress(initialProgress);
    } catch (err) {
      console.error(err);
      setError('কোর্স লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressData = async () => {
    try {
      if (!user) return;
      
      const res = await axios.get(`/api/courses/${params.id}/progress`, {
        headers: {
          'user-id': user.uid
        }
      });
      
      setProgressData(res.data);
      
      if (res.data.classProgress) {
        const updatedProgress = {};
        res.data.classProgress.forEach((cp) => {
          updatedProgress[cp.classIndex] = {
            completed: cp.completed || false,
            progress: cp.progress || 0,
            lastWatched: cp.lastWatched
          };
        });
        setUserProgress(updatedProgress);
      }
    } catch (err) {
      console.error('Progress data fetch error:', err);
      setProgressData({
        overallProgress: 0,
        completedClasses: 0,
        totalClasses: course?.classes?.length || 0,
        averageScore: 0
      });
    }
  };

  const updateClassProgress = async (classIndex, completed) => {
    try {
      if (!user) {
        alert('প্রথমে লগিন করুন');
        return;
      }

      const newUserProgress = {
        ...userProgress,
        [classIndex]: {
          ...userProgress[classIndex],
          completed: completed,
          progress: completed ? 100 : 0,
          lastWatched: new Date().toISOString()
        }
      };
      setUserProgress(newUserProgress);

      const totalClasses = course.classes?.length || 1;
      const completedClasses = Object.values(newUserProgress).filter(p => p.completed).length;
      const overallProgress = Math.round((completedClasses / totalClasses) * 100);

      const updatedProgressData = {
        ...progressData,
        overallProgress,
        completedClasses,
        totalClasses
      };
      setProgressData(updatedProgressData);

      await axios.post(`/api/courses/${params.id}/progress`, {
        classIndex,
        completed,
        overallProgress,
        completedClasses,
        totalClasses
      }, {
        headers: {
          'user-id': user.uid,
          'Content-Type': 'application/json'
        }
      });

      // Auto-expand next module if completed
      if (completed) {
        const modules = organizeClassesIntoModules();
        const currentModule = modules.find(m => 
          classIndex >= m.startIndex && classIndex < m.startIndex + m.classes.length
        );
        
        if (currentModule) {
          const nextClassIndex = classIndex + 1;
          const nextModule = modules.find(m => 
            nextClassIndex >= m.startIndex && nextClassIndex < m.startIndex + m.classes.length
          );
          
          if (nextModule && !expandedModules.includes(nextModule.index)) {
            setExpandedModules([...expandedModules, nextModule.index]);
          }
        }
      }

    } catch (err) {
      console.error('Progress update error:', err);
    }
  };

  const handleNextClass = () => {
    if (course?.classes && activeClass < course.classes.length - 1) {
      const nextClass = activeClass + 1;
      setActiveClass(nextClass);
      setIsPlaying(true);
      
      // Update last watched time for next class
      if (userProgress[nextClass]) {
        const newUserProgress = {
          ...userProgress,
          [nextClass]: {
            ...userProgress[nextClass],
            lastWatched: new Date().toISOString()
          }
        };
        setUserProgress(newUserProgress);
      }

      // Scroll to top on mobile
      if (window.innerWidth < 1024) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleClassSelect = (index) => {
    setActiveClass(index);
    setIsPlaying(true);
    
    if (userProgress[index]) {
      const newUserProgress = {
        ...userProgress,
        [index]: {
          ...userProgress[index],
          lastWatched: new Date().toISOString()
        }
      };
      setUserProgress(newUserProgress);
    }

    // Close mobile curriculum on selection
    setShowMobileCurriculum(false);
  };

  const toggleModule = (moduleIndex) => {
    setExpandedModules(prev =>
      prev.includes(moduleIndex)
        ? prev.filter(i => i !== moduleIndex)
        : [...prev, moduleIndex]
    );
  };

  const organizeClassesIntoModules = () => {
    if (!course?.classes) return [];
    
    // Split classes into modules of 3-5 classes each
    const classesPerModule = 4;
    const modules = [];
    
    for (let i = 0; i < course.classes.length; i += classesPerModule) {
      const moduleClasses = course.classes.slice(i, i + classesPerModule);
      modules.push({
        index: modules.length,
        title: `মডিউল ${modules.length + 1}`,
        classes: moduleClasses,
        startIndex: i,
        locked: modules.length > 0 // Lock modules after first one
      });
    }
    
    return modules;
  };

  const getVideoUrl = () => {
    if (!course) return '';
    
    if (course.classes && course.classes.length > activeClass) {
      return course.classes[activeClass]?.videoUrl || '';
    }
    
    return course.videoUrl || '';
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0&controls=1`;
    }
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0&controls=1`;
    }
    
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    return url;
  };

  const modules = organizeClassesIntoModules();
  const videoUrl = getVideoUrl();
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  const isYouTubeVideo = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isLastClass = activeClass === (course?.classes?.length || 1) - 1;
  const currentClass = course?.classes?.[activeClass];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">কোর্স লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-red-500 text-xl font-bold mb-3">⚠️ সমস্যা হয়েছে</div>
          <p className="text-gray-700 mb-6">{error || 'কোর্স খুঁজে পাওয়া যায়নি'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.href = '/courses'}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              অন্যান্য কোর্স
            </button>
            <button
              onClick={fetchCourse}
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="পিছনে যান"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              
              <div>
                <h1 className="text-lg font-bold text-gray-900 line-clamp-1">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {course.instructor}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Desktop Progress Indicator */}
              <div className="hidden lg:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600 font-medium">অগ্রগতি</p>
                  <p className="text-lg font-bold text-blue-600">
                    {progressData?.overallProgress || 0}%
                  </p>
                </div>
                <div className="w-32">
                  <ProgressBar progress={progressData?.overallProgress || 0} size="sm" showPercentage={false} />
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setShowMobileCurriculum(!showMobileCurriculum)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Menu className="w-4 h-4" />
                <span className="text-sm font-medium">কারিকুলাম</span>
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Bookmark className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area - Video & Progress */}
          <div className="lg:w-2/3">
            {/* Video Player */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-6">
              <div className="relative w-full aspect-video">
                {isYouTubeVideo ? (
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full"
                    title={currentClass?.title || course.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  />
                ) : videoUrl ? (
                  <video
                    src={videoUrl}
                    className="w-full h-full"
                    controls
                    poster={course.thumbnail}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <Video className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-gray-400 text-lg mb-2">ভিডিও নেই</p>
                    <p className="text-gray-500">এই লেসনে এখনো ভিডিও যোগ করা হয়নি</p>
                  </div>
                )}

                {/* Video Overlay Info */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full">
                    <span className="text-white text-sm font-medium">
                      লেসন {activeClass + 1} / {course.classes?.length || 1}
                    </span>
                  </div>
                  {isYouTubeVideo && (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-full flex items-center gap-1 transition-colors"
                    >
                      <Youtube className="w-4 h-4" />
                      YouTube এ দেখুন
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Section Under Video */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">আপনার অগ্রগতি</h2>
                  <p className="text-gray-600">কোর্সটি সম্পূর্ণ করতে আরো {progressData?.totalClasses - progressData?.completedClasses || 0} টি লেসন বাকি</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{progressData?.overallProgress || 0}%</div>
                    <div className="text-sm text-gray-600">সম্পূর্ণ</div>
                  </div>
                  <button
                    onClick={() => updateClassProgress(activeClass, !userProgress[activeClass]?.completed)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      userProgress[activeClass]?.completed
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {userProgress[activeClass]?.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        সম্পূর্ণ হয়েছে
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        মার্ক করুন
                      </>
                    )}
                  </button>
                </div>
              </div>

              <ProgressBar 
                progress={progressData?.overallProgress || 0} 
                label="মোট অগ্রগতি" 
                size="lg" 
                showPercentage={false}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <StatsCard 
                  icon={Target}
                  label="সম্পূর্ণ লেসন"
                  value={`${progressData?.completedClasses || 0}/${progressData?.totalClasses || 0}`}
                  color="text-blue-600"
                  trend={progressData?.completedClasses || 0}
                />
                <StatsCard 
                  icon={Clock}
                  label="বাকি সময়"
                  value={`${Math.ceil(((progressData?.totalClasses - progressData?.completedClasses) || 0) * 0.5)} ঘন্টা`}
                  color="text-purple-600"
                />
                <StatsCard 
                  icon={TrendingUp}
                  label="কোর্স রেটিং"
                  value={course.rating}
                  color="text-yellow-600"
                />
              </div>
            </div>

            {/* Current Class Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentClass?.title || 'কোর্স পরিচিতি'}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {currentClass?.duration || '45:00'} মিনিট
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {course.instructor}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date().toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Resources */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  লেসন রিসোর্স
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a
                    href="#"
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">লেকচার নোটস</p>
                        <p className="text-sm text-gray-600">PDF • 2.4 MB</p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </a>

                  <a
                    href="#"
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">প্র্যাকটিস ফাইল</p>
                        <p className="text-sm text-gray-600">ZIP • 15.2 MB</p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                  </a>
                </div>
              </div>
            </div>

            {/* Next Button - Prominent Position */}
            <div className="sticky bottom-6 z-10 lg:relative lg:bottom-auto">
              <NextButton
                onClick={handleNextClass}
                disabled={!course.classes || activeClass >= course.classes.length - 1}
                isLastClass={isLastClass}
                label={isLastClass ? "কোর্স সম্পূর্ণ করুন" : "পরবর্তী লেসন"}
                className="shadow-xl"
              />
            </div>
          </div>

          {/* Desktop Sidebar - Course Curriculum */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ListChecks className="w-5 h-5" />
                  কোর্স কারিকুলাম
                </h3>
                <span className="text-sm font-medium text-blue-600">
                  {progressData?.completedClasses || 0}/{progressData?.totalClasses || 0} সম্পূর্ণ
                </span>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {modules.map((module) => (
                  <CourseModule
                    key={module.index}
                    module={module}
                    index={module.index}
                    activeClass={activeClass}
                    userProgress={userProgress}
                    onSelectClass={handleClassSelect}
                    isExpanded={expandedModules.includes(module.index)}
                    onToggle={() => toggleModule(module.index)}
                  />
                ))}
              </div>

              {/* Course Completion Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">কোর্স সম্পূর্ণ হবে</span>
                  <span className="text-sm font-medium text-gray-900">
                    {progressData?.overallProgress || 0}%
                  </span>
                </div>
                <ProgressBar progress={progressData?.overallProgress || 0} size="sm" />
                
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">আপনি ভালো করছেন!</p>
                      <p className="text-sm text-gray-600">
                        {progressData?.completedClasses || 0} টি লেসন সম্পূর্ণ করেছেন
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Curriculum Modal */}
      {showMobileCurriculum && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileCurriculum(false)}
          />
          
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 lg:hidden max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">কোর্স কারিকুলাম</h3>
                <button 
                  onClick={() => setShowMobileCurriculum(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">
                  {course.classes?.length || 0} টি লেসন
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {progressData?.completedClasses || 0} সম্পূর্ণ
                </span>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-4">
              {modules.map((module) => (
                <CourseModule
                  key={module.index}
                  module={module}
                  index={module.index}
                  activeClass={activeClass}
                  userProgress={userProgress}
                  onSelectClass={handleClassSelect}
                  isExpanded={expandedModules.includes(module.index)}
                  onToggle={() => toggleModule(module.index)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}