'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Clock,
  Calendar,
  Award,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingDown,
  Eye,
  Lock,
  Home,
  DollarSign,
  BarChart,
  Bookmark,
  Target,
  Activity,
  Video,
  Download,
  Filter,
  Edit,
  MoreVertical,
  Share2,
  GraduationCap,
  Briefcase,
  Users as UsersIcon
} from 'lucide-react';
import useRole from '@/hooks/useRole';


export default function Dashboard() {
  const { role, loading } = useRole();
  const [timeRange, setTimeRange] = useState('week');

  // Get dashboard data based on user role
  const getDashboardData = () => {
    switch(role) {
      case 'teacher':
        return {
          stats: [
            { title: 'My Students', value: 87, icon: Users, change: +15, color: 'blue' },
            { title: 'Active Courses', value: 6, icon: BookOpen, change: +2, color: 'purple' },
            { title: 'Hours Taught', value: '142h', icon: Clock, change: +18, color: 'green' },
            { title: 'Avg. Rating', value: '4.8', icon: Star, change: +0.2, color: 'yellow' },
          ],
          courses: [
            { id: 1, name: 'React Masterclass', students: 45, progress: 85, nextClass: 'Tomorrow 10 AM' },
            { id: 2, name: 'Advanced JavaScript', students: 32, progress: 72, nextClass: 'Today 2 PM' },
            { id: 3, name: 'Web Development', students: 56, progress: 91, nextClass: 'Friday 11 AM' },
          ],
          recentStudents: [
            { id: 1, name: 'John Doe', email: 'john@example.com', progress: 85, lastActive: '2 hours ago' },
            { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', progress: 72, lastActive: '1 day ago' },
            { id: 3, name: 'Mike Johnson', email: 'mike@example.com', progress: 91, lastActive: '3 hours ago' },
          ],
          upcomingTasks: [
            { id: 1, task: 'Grade Assignment #4', course: 'React Masterclass', due: 'Today, 5 PM' },
            { id: 2, task: 'Prepare Lecture Notes', course: 'Advanced JS', due: 'Tomorrow, 9 AM' },
            { id: 3, task: 'Student Consultations', course: 'All', due: 'Friday, 2 PM' },
          ]
        };

      case 'student':
        return {
          stats: [
            { title: 'Enrolled Courses', value: 5, icon: BookOpen, change: +1, color: 'blue' },
            { title: 'Hours Learned', value: '89h', icon: Clock, change: +24, color: 'green' },
            { title: 'Avg. Score', value: '92%', icon: Award, change: +3, color: 'purple' },
            { title: 'Assignments Due', value: 3, icon: FileText, change: -1, color: 'red' },
          ],
          courses: [
            { id: 1, name: 'React Masterclass', progress: 85, nextLesson: 'State Management', instructor: 'John Smith' },
            { id: 2, name: 'Advanced JavaScript', progress: 72, nextLesson: 'Async Patterns', instructor: 'Sarah Lee' },
            { id: 3, name: 'Web Development', progress: 91, nextLesson: 'Deployment', instructor: 'Mike Chen' },
          ],
          upcomingAssignments: [
            { id: 1, title: 'React Hooks Assignment', course: 'React Masterclass', due: 'Today, 5 PM', status: 'pending' },
            { id: 2, title: 'JavaScript Algorithms', course: 'Advanced JS', due: 'Tomorrow, 10 AM', status: 'in-progress' },
            { id: 3, title: 'Final Project', course: 'Web Development', due: 'Next Week', status: 'pending' },
          ],
          achievements: [
            { id: 1, title: 'Fast Learner', description: 'Complete 5 courses in a month', icon: Award, earned: true },
            { id: 2, title: 'Consistency King', description: '30 day learning streak', icon: TrendingUp, earned: false },
            { id: 3, title: 'Top Performer', description: 'Score above 90% in all quizzes', icon: Star, earned: true },
          ]
        };

      case 'admin':
        return {
          stats: [
            { title: 'Total Users', value: 1292, icon: Users, change: +8, color: 'blue' },
            { title: 'Active Courses', value: 28, icon: BookOpen, change: +4, color: 'purple' },
            { title: 'Revenue', value: '$45,890', icon: DollarSign, change: +12, color: 'green' },
            { title: 'Completion Rate', value: '78%', icon: TrendingUp, change: +5, color: 'yellow' },
          ],
          recentActivities: [
            { id: 1, user: 'John Doe', action: 'Completed Course', course: 'React Masterclass', time: '2 hours ago', role: 'student' },
            { id: 2, user: 'Sarah Smith', action: 'Created Course', course: 'Advanced JavaScript', time: '4 hours ago', role: 'teacher' },
            { id: 3, user: 'Mike Johnson', action: 'Submitted Assignment', time: '6 hours ago', role: 'student' },
            { id: 4, user: 'Emma Wilson', action: 'Updated Profile', time: '1 day ago', role: 'teacher' },
          ],
          userDistribution: {
            students: 1247,
            teachers: 45,
            admins: 3
          },
          systemMetrics: [
            { metric: 'Server Uptime', value: '99.9%', status: 'good' },
            { metric: 'Active Sessions', value: '342', status: 'normal' },
            { metric: 'Storage Used', value: '78%', status: 'warning' },
            { metric: 'API Response', value: '120ms', status: 'good' },
          ]
        };

      default:
        return {
          stats: [
            { title: 'Enrolled Courses', value: 0, icon: BookOpen, change: 0, color: 'blue' },
            { title: 'Learning Hours', value: '0h', icon: Clock, change: 0, color: 'green' },
            { title: 'Progress', value: '0%', icon: TrendingUp, change: 0, color: 'purple' },
            { title: 'Messages', value: 0, icon: MessageSquare, change: 0, color: 'red' },
          ]
        };
    }
  };

  const dashboardData = getDashboardData();
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {isTeacher ? 'Teacher Dashboard' : 
                   isStudent ? 'Student Dashboard' : 
                   isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isAdmin ? 'bg-purple-100 text-purple-800' :
                  isTeacher ? 'bg-blue-100 text-blue-800' :
                  isStudent ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {role?.charAt(0).toUpperCase() + role?.slice(1)}
                </span>
              </div>
              <p className="text-gray-600">
                {isTeacher ? 'Manage your courses and students' :
                 isStudent ? 'Track your learning progress and assignments' :
                 isAdmin ? 'Monitor platform performance and user activity' :
                 'Welcome to your learning dashboard'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Period:</span>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="day">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              
              <button className="relative p-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Home className="w-4 h-4" />
              <span>Overview</span>
            </button>
            
            {isTeacher && (
              <>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="w-4 h-4" />
                  <span>My Courses</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <UsersIcon className="w-4 h-4" />
                  <span>My Students</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule</span>
                </button>
              </>
            )}
            
            {isStudent && (
              <>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="w-4 h-4" />
                  <span>My Learning</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>Assignments</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Award className="w-4 h-4" />
                  <span>Achievements</span>
                </button>
              </>
            )}
            
            {isAdmin && (
              <>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <BarChart className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="w-4 h-4" />
                  <span>User Management</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>System Settings</span>
                </button>
              </>
            )}
            
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">3</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'purple' ? 'bg-purple-100' :
                  stat.color === 'yellow' ? 'bg-yellow-100' :
                  stat.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {React.createElement(stat.icon, { 
                    className: `w-6 h-6 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'purple' ? 'text-purple-600' :
                      stat.color === 'yellow' ? 'text-yellow-600' :
                      stat.color === 'red' ? 'text-red-600' : 'text-gray-600'
                    }`
                  })}
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change > 0 ? 
                    React.createElement(TrendingUp, { className: "w-4 h-4" }) : 
                    React.createElement(TrendingDown, { className: "w-4 h-4" })
                  }
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Courses Section */}
            {(isTeacher || isStudent) && dashboardData.courses && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isTeacher ? 'My Courses' : 'My Learning Progress'}
                  </h2>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {dashboardData.courses.map(course => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{course.name}</h3>
                          <p className="text-sm text-gray-600">
                            {isTeacher ? `${course.students} students` : `Instructor: ${course.instructor}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-semibold">{course.progress}%</span>
                          </div>
                          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {isTeacher ? `Next: ${course.nextClass}` : `Next: ${course.nextLesson}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activities for Admin */}
            {isAdmin && dashboardData.recentActivities && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {dashboardData.recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.role === 'student' ? 'bg-green-100' :
                        activity.role === 'teacher' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        <Users className={`w-5 h-5 ${
                          activity.role === 'student' ? 'text-green-600' :
                          activity.role === 'teacher' ? 'text-blue-600' : 'text-purple-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{activity.user}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            activity.role === 'student' ? 'bg-green-100 text-green-800' :
                            activity.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {activity.role}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {activity.action} {activity.course && `in ${activity.course}`}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assignments for Student */}
            {isStudent && dashboardData.upcomingAssignments && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Assignments</h2>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {dashboardData.upcomingAssignments.map(assignment => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">{assignment.course}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {assignment.status}
                        </span>
                        <span className="text-sm text-gray-600">Due: {assignment.due}</span>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks for Teacher */}
            {isTeacher && dashboardData.upcomingTasks && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Tasks</h2>
                <div className="space-y-4">
                  {dashboardData.upcomingTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{task.task}</h3>
                          <p className="text-sm text-gray-600">{task.course}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Due: {task.due}</span>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Start
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Achievements for Student */}
            {isStudent && dashboardData.achievements && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
                <div className="space-y-4">
                  {dashboardData.achievements.map(achievement => (
                    <div key={achievement.id} className={`flex items-center gap-4 p-4 rounded-xl ${
                      achievement.earned ? 'bg-gradient-to-r from-yellow-50 to-white border border-yellow-100' : 'bg-gray-50'
                    }`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        achievement.earned ? 'bg-yellow-100' : 'bg-gray-200'
                      }`}>
                        {React.createElement(achievement.icon, { 
                          className: `w-6 h-6 ${achievement.earned ? 'text-yellow-600' : 'text-gray-400'}`
                        })}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      {achievement.earned ? (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Students for Teacher */}
            {isTeacher && dashboardData.recentStudents && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Students</h2>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {dashboardData.recentStudents.map(student => (
                    <div key={student.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{student.progress}%</div>
                        <div className="text-xs text-gray-500">{student.lastActive}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Distribution for Admin */}
            {isAdmin && dashboardData.userDistribution && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">User Distribution</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Students</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{dashboardData.userDistribution.students}</span>
                      <span className="text-sm text-gray-500 ml-2">(96%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Teachers</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{dashboardData.userDistribution.teachers}</span>
                      <span className="text-sm text-gray-500 ml-2">(3.5%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Admins</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{dashboardData.userDistribution.admins}</span>
                      <span className="text-sm text-gray-500 ml-2">(0.5%)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="h-2 flex rounded-full overflow-hidden">
                    <div className="bg-green-500" style={{ width: '96%' }}></div>
                    <div className="bg-blue-500" style={{ width: '3.5%' }}></div>
                    <div className="bg-purple-500" style={{ width: '0.5%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-6">Quick Links</h2>
              <div className="space-y-3">
                <button className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  <span>{isTeacher ? 'Create New Course' : isStudent ? 'Browse Courses' : 'System Analytics'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  <span>{isTeacher ? 'Schedule Classes' : isStudent ? 'View Calendar' : 'User Reports'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  <span>Help & Support</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  <span>Settings</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}