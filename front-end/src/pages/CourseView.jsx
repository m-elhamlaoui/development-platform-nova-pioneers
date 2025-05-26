import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, BarChart2, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import KidSidebar from '../components/KidSidebar';
const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:9093' : 'http://http://141.144.226.68:9093'; // Replace with your actual production API URL
};
const CourseView = ({ baseUrl = getApiBaseUrl() }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [userType, setUserType] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseProgress, setCourseProgress] = useState({ progress: 0, last_accessed: null });
  
  // Get user data from storage
  const getUserData = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      return {
        id: user.id,
        type: user.type || 'kid' // Default to kid if type is not specified
      };
    } catch (err) {
      console.error('Error parsing user data:', err);
      return { id: null, type: null };
    }
  };
  
  const { id: userId, type: userRole } = getUserData();
  
  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  // Fetch course data and enrollment status
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!userId || !courseId) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        setUserType(userRole || 'kid');
        
        // Fetch course details
        const courseResponse = await fetch(`${baseUrl}/courses/${courseId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!courseResponse.ok) {
          throw new Error(`Failed to fetch course: ${courseResponse.status}`);
        }

        const courseData = await courseResponse.json();
        setCourse(courseData);
        
        // If user is a kid, check enrollment and progress
        if (userRole === 'kid') {
          // Check if enrolled
          const enrollmentsResponse = await fetch(`${baseUrl}/kids/${userId}/enrollments`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          
          if (enrollmentsResponse.ok) {
            const enrollments = await enrollmentsResponse.json();
            const courseEnrollment = enrollments.find(e => 
              e.course_id === courseId || e.course_id === Number(courseId)
            );
            
            setIsEnrolled(!!courseEnrollment);
            
            if (courseEnrollment) {
              // Fetch progress if enrolled
              const progressResponse = await fetch(`${baseUrl}/kids/${userId}/courses/${courseId}/progress`, {
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              });

              if (progressResponse.ok) {
                const progressData = await progressResponse.json();
                setCourseProgress({
                  progress: progressData.progress || 0,
                  last_accessed: progressData.last_accessed || null
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        toast.error(`Failed to load course: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [userId, courseId, userRole, baseUrl, navigate]);
  
  // Handle start/continue learning
  const handleStartLearning = () => {
    if (!isEnrolled) {
      toast.error("You need to be enrolled in this course first");
      return;
    }
    
    navigate(`/course/${courseId}/learn`);
  };
  
  // Add the same badge functions
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

  const determineBadgeColor = (xp) => {
    if (xp >= 2000) return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
    if (xp >= 1500) return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
    if (xp >= 1000) return "bg-gradient-to-r from-blue-500 to-purple-600 text-white";
    if (xp >= 750) return "bg-gradient-to-r from-indigo-500 to-blue-600 text-white";
    if (xp >= 500) return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
    if (xp >= 300) return "bg-gradient-to-r from-green-400 to-blue-500 text-white";
    if (xp >= 150) return "bg-gradient-to-r from-green-400 to-green-600 text-white";
    if (xp >= 50) return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
    return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        {userType === 'kid' && <KidSidebar baseUrl={baseUrl} />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {userType === 'kid' && <KidSidebar baseUrl={baseUrl} />}
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back navigation */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-blue-600 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          {/* Course header with image */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="h-48 bg-gray-200">
              {course?.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
                  <BookOpen className="text-white w-16 h-16 opacity-70" />
                </div>
              )}
            </div>
            
            <div className="p-6">
              {/* Course metadata */}
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="flex gap-2">
                  <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded">
                    {course?.subject || 'General'}
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded">
                    {course?.grade_level || 'All Levels'}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <BarChart2 className="w-4 h-4 mr-1" />
                  <span>{course?.xp_value || 100} XP</span>
                </div>
              </div>
              
              {/* Course title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {course?.title}
              </h1>
              
              {/* Instructor */}
              <p className="text-gray-600 mb-4">
                Instructor: <span className="font-medium">{course?.instructor || 'Staff Instructor'}</span>
              </p>
              
              {/* Course description */}
              <div className="border-t border-b border-gray-100 py-4 my-4">
                <h2 className="font-semibold mb-2">About This Course</h2>
                <p className="text-gray-700">
                  {course?.description || 'No description available.'}
                </p>
              </div>
              
              {/* Status and action */}
              {userType === 'kid' && (
                <div className="flex items-center justify-between">
                  <div>
                    {isEnrolled ? (
                      <>
                        {courseProgress.progress > 0 ? (
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="text-sm text-gray-600 mr-2">Progress:</span>
                              <div className="w-32 bg-gray-100 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${courseProgress.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                                  style={{width: `${courseProgress.progress}%`}}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm font-medium">
                                {courseProgress.progress}%
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Last accessed: {formatDate(courseProgress.last_accessed)}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Not started yet</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center text-orange-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span>You are not enrolled in this course</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleStartLearning}
                    disabled={!isEnrolled}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      isEnrolled 
                        ? courseProgress.progress === 100
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {!isEnrolled 
                      ? 'Ask Parent to Enroll'
                      : courseProgress.progress === 0
                        ? 'Start Learning'
                        : courseProgress.progress === 100
                          ? 'Review Course'
                          : 'Continue Learning'
                    }
                  </button>
                </div>
              )}
              
              {/* Parent-specific features */}
              {userType === 'parent' && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-gray-600">
                    You can enroll your child(ren) in this course from the courses section on your dashboard.
                  </p>
                  <button
                    onClick={() => navigate('/parent-dashboard')}
                    className="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Course content preview */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="font-bold text-lg mb-4">Course Content</h2>
            <div className="space-y-3">
              {/* This would be replaced with actual lesson data */}
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                      {i}
                    </div>
                    <span>Lesson {i}</span>
                  </div>
                  {userType === 'kid' && isEnrolled && courseProgress.progress >= ((i - 1) / 3) * 100 ? (
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  ) : (
                    <span className="text-xs text-gray-500">Locked</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;