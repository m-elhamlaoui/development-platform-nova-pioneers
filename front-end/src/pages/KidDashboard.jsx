import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Search, BookOpen, BarChart2, Clock, ChevronRight, CircleSlash, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import KidSidebar from '../components/KidSidebar';

const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:9093' : 'http://141.144.226.68:9093'; // Replace with your actual production API URL
};

const KidDashboard = ({ baseUrl = getApiBaseUrl() }) => {
  const navigate = useNavigate();
  
  // State variables
  const [activeTab, setActiveTab] = useState('enrolled');
  const [kidData, setKidData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Get kid ID from storage
  const getKidId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      return user.id || null;
    } catch (err) {
      console.error('Error parsing user data:', err);
      return null;
    }
  };
  
  const kidId = getKidId();
  
  // Determine badge based on XP with beautiful titles
  const determineBadge = (xp) => {
    if (xp >= 2000) return "🌟 Master Explorer";
    if (xp >= 1500) return "🏆 Champion Pioneer";
    if (xp >= 1000) return "💎 Expert Adventurer";
    if (xp >= 750) return "🚀 Space Pioneer";
    if (xp >= 500) return "🔥 Advanced Explorer";
    if (xp >= 300) return "⭐ Rising Star";
    if (xp >= 150) return "🌱 Growing Pioneer";
    if (xp >= 50) return "🎯 Junior Explorer";
    return "🌟 New Pioneer";
  };
  
  // Determine badge color based on XP with gradient colors
  const determineBadgeColor = (xp) => {
    if (xp >= 2000) return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"; // Master
    if (xp >= 1500) return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"; // Champion
    if (xp >= 1000) return "bg-gradient-to-r from-blue-500 to-purple-600 text-white"; // Expert
    if (xp >= 750) return "bg-gradient-to-r from-indigo-500 to-blue-600 text-white"; // Space
    if (xp >= 500) return "bg-gradient-to-r from-red-500 to-pink-500 text-white"; // Advanced
    if (xp >= 300) return "bg-gradient-to-r from-green-400 to-blue-500 text-white"; // Rising Star
    if (xp >= 150) return "bg-gradient-to-r from-green-400 to-green-600 text-white"; // Growing
    if (xp >= 50) return "bg-gradient-to-r from-blue-400 to-blue-600 text-white"; // Junior
    return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"; // New
  };

  // Get next title and XP needed
  const getNextTitleInfo = (currentXp) => {
    const titles = [
      { xp: 50, title: "🎯 Junior Explorer" },
      { xp: 150, title: "🌱 Growing Pioneer" },
      { xp: 300, title: "⭐ Rising Star" },
      { xp: 500, title: "🔥 Advanced Explorer" },
      { xp: 750, title: "🚀 Space Pioneer" },
      { xp: 1000, title: "💎 Expert Adventurer" },
      { xp: 1500, title: "🏆 Champion Pioneer" },
      { xp: 2000, title: "🌟 Master Explorer" }
    ];

    const nextTitle = titles.find(title => currentXp < title.xp);
    if (nextTitle) {
      return {
        title: nextTitle.title,
        xpNeeded: nextTitle.xp - currentXp
      };
    }
    return null; // Already at max level
  };
  
  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  // Fetch kid data, enrollments and course progress
  useEffect(() => {
    const fetchKidData = async () => {
      if (!kidId) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        // Fetch kid profile data
        const kidResponse = await fetch(`${baseUrl}/kids/${kidId}/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!kidResponse.ok) {
          throw new Error(`Failed to fetch kid data: ${kidResponse.status}`);
        }
        
        const kidData = await kidResponse.json();
        setKidData(kidData);
        
        // Fetch enrollments
        const enrollmentsResponse = await fetch(`${baseUrl}/kids/${kidId}/enrollments`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!enrollmentsResponse.ok) {
          throw new Error(`Failed to fetch enrollments: ${enrollmentsResponse.status}`);
        }
        
        const enrollments = await enrollmentsResponse.json();
        
        // Fetch actual course data for each enrollment
        const coursesData = [];
        const progressData = {};
        
        for (const enrollment of enrollments) {
          try {
            const courseId = enrollment.course_id;
            
            // Fetch course details
            const courseResponse = await fetch(`${baseUrl}/courses/${courseId}`, {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            });
            
            if (courseResponse.ok) {
              const course = await courseResponse.json();
              coursesData.push(course);
              
              // Use enrollment data for progress
              progressData[courseId] = {
                progress: enrollment.progress_percentage || 0,
                last_accessed: enrollment.enrolled_at
              };
            }
          } catch (err) {
            console.error(`Error fetching course ${enrollment.course_id}:`, err);
          }
        }
        
        setEnrolledCourses(coursesData);
        setCourseProgress(progressData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast.error(`Failed to load dashboard: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchKidData();
  }, [kidId, baseUrl, navigate]);
  
  // Continue a course (navigate to most recent lesson)
  const continueCourse = (courseId) => {
    navigate(`/course/${courseId}/learn`);
  };
  
  // Update course progress function
  const updateCourseProgress = async (courseId, progressValue) => {
    if (!kidId) return;
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      // Find the enrollment ID for this course
      const enrollmentsResponse = await fetch(`${baseUrl}/kids/${kidId}/enrollments`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!enrollmentsResponse.ok) {
        throw new Error(`Failed to fetch enrollments: ${enrollmentsResponse.status}`);
      }
      
      const enrollments = await enrollmentsResponse.json();
      const enrollment = enrollments.find(e => e.course_id === courseId || e.course_id === Number(courseId));
      
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }
      
      const response = await fetch(`${baseUrl}/kids/${kidId}/enrollments/${enrollment.enrollment_id}/progress`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          progress_percentage: progressValue
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update progress: ${response.status}`);
      }
      
      // Update local state
      setCourseProgress(prev => ({
        ...prev,
        [courseId]: {
          progress: progressValue,
          last_accessed: new Date().toISOString()
        }
      }));
      
    } catch (err) {
      console.error("Error updating progress:", err);
      toast.error(`Failed to update progress: ${err.message}`);
    }
  };
  
  // Filter courses based on search term
  const filteredCourses = enrolledCourses.filter(course =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort courses: In Progress first, then Completed, then Not Started
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const progressA = courseProgress[a.id]?.progress || 0;
    const progressB = courseProgress[b.id]?.progress || 0;
    
    // First sort by course status
    if (progressA === 100 && progressB !== 100) return 1;
    if (progressB === 100 && progressA !== 100) return -1;
    if (progressA > 0 && progressB === 0) return -1;
    if (progressB > 0 && progressA === 0) return 1;
    
    // Then sort by last accessed date if both are in progress
    if (progressA > 0 && progressB > 0) {
      const dateA = new Date(courseProgress[a.id]?.last_accessed || 0);
      const dateB = new Date(courseProgress[b.id]?.last_accessed || 0);
      return dateB - dateA; // Most recent first
    }
    
    return 0;
  });
  
  // Get courses based on active tab
  const getFilteredCourses = () => {
    switch (activeTab) {
      case 'in-progress':
        return sortedCourses.filter(course => {
          const progress = courseProgress[course.id]?.progress || 0;
          return progress > 0 && progress < 100;
        });
      case 'completed':
        return sortedCourses.filter(course => {
          const progress = courseProgress[course.id]?.progress || 0;
          return progress === 100;
        });
      case 'not-started':
        return sortedCourses.filter(course => {
          const progress = courseProgress[course.id]?.progress || 0;
          return progress === 0;
        });
      case 'enrolled':
      default:
        return sortedCourses;
    }
  };
  
  const displayCourses = getFilteredCourses();
  
  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <KidSidebar baseUrl={baseUrl} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <KidSidebar baseUrl={baseUrl} />
      
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {kidData && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {kidData.first_name?.charAt(0)}{kidData.last_name?.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Welcome back, {kidData.first_name}! 👋
                    </h1>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${determineBadgeColor(kidData.total_xp || 0)}`}>
                        {kidData.title || determineBadge(kidData.total_xp || 0)}
                      </span>
                      <span className="text-gray-600 flex items-center">
                        ⚡ {kidData.total_xp || 0} XP
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Progress to next title */}
                {(() => {
                  const nextInfo = getNextTitleInfo(kidData.total_xp || 0);
                  return nextInfo ? (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Next Title:</p>
                      <p className="text-lg font-semibold text-gray-800">{nextInfo.title}</p>
                      <p className="text-sm text-blue-600">🎯 {nextInfo.xpNeeded} XP to go!</p>
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-lg font-semibold text-purple-600">🏆 Max Level Achieved!</p>
                      <p className="text-sm text-gray-600">You're a true master!</p>
                    </div>
                  );
                })()}
              </div>
              
              {/* XP Progress Bar */}
              {(() => {
                const nextInfo = getNextTitleInfo(kidData.total_xp || 0);
                if (nextInfo) {
                  const currentXp = kidData.total_xp || 0;
                  const prevTitleXp = currentXp - nextInfo.xpNeeded > 0 ? 
                    nextInfo.xp - nextInfo.xpNeeded - (nextInfo.xp - currentXp) : 0;
                  const progressPercent = ((currentXp - prevTitleXp) / (nextInfo.xp - prevTitleXp)) * 100;
                  
                  return (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="bg-white rounded-lg flex items-center px-4 py-2 w-full sm:w-auto flex-grow shadow-sm border border-gray-100">
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your courses..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="ml-3 outline-none text-gray-700 w-full"
              />
            </div>
            
            <div className="flex gap-2 overflow-auto pb-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === 'enrolled' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Courses
              </button>
              <button
                onClick={() => setActiveTab('in-progress')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === 'in-progress' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === 'completed' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab('not-started')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === 'not-started' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Not Started
              </button>
            </div>
          </div>
          
          {/* Course grid */}
          {displayCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCourses.map(course => {
                const progress = courseProgress[course.id]?.progress || 0;
                const lastAccessed = courseProgress[course.id]?.last_accessed;
                
                return (
                  <div 
                    key={course.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    {/* Course thumbnail */}
                    <div className="h-36 bg-gray-200 overflow-hidden">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
                          <BookOpen className="text-white w-12 h-12 opacity-70" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      {/* Course metadata */}
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {course.subject || 'General'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {course.grade_level || 'All Levels'}
                        </span>
                      </div>
                      
                      {/* Course title */}
                      <h3 className="font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      
                      {/* Progress bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className={progress === 100 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                            {progress === 100 ? 'Completed' : `${progress}% complete`}
                          </span>
                          {progress > 0 && progress < 100 && (
                            <span className="text-gray-500">
                              In progress
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                            }`} 
                            style={{width: `${progress}%`}}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Course details */}
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          <span>
                            {lastAccessed 
                              ? `Last activity: ${formatDate(lastAccessed).split(' at')[0]}`
                              : 'Not started yet'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <BarChart2 className="w-3.5 h-3.5 mr-1" />
                          <span>{course.xp_value || 100} XP</span>
                        </div>
                      </div>
                      
                      {/* Action button */}
                      <button
                        onClick={() => continueCourse(course.id)}
                        className={`w-full py-2 rounded-lg flex items-center justify-center font-medium ${
                          progress === 100 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {progress === 0
                          ? 'Start Learning'
                          : progress === 100
                            ? 'Review Course'
                            : 'Continue Learning'
                        }
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl text-center">
              <CircleSlash size={48} className="text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-lg text-gray-700 mb-1">No courses found</h3>
              <p className="text-gray-500 mb-0">
                {searchTerm
                  ? `No courses match "${searchTerm}". Try a different search term.`
                  : activeTab !== 'enrolled'
                    ? `You don't have any ${activeTab.replace('-', ' ')} courses yet.`
                    : "You aren't enrolled in any courses yet. Ask a parent to enroll you in courses!"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KidDashboard;