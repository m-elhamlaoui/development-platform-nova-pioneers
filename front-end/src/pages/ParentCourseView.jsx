import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, Users, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import Menu from '../components/ui/Menu';
const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:9093' : 'https://http://141.144.226.68/9093'; // Replace with your actual production API URL
};
const ParentCourseView = ({ baseUrl = getApiBaseUrl() }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [kidsData, setKidsData] = useState([]);
  const [enrollments, setEnrollments] = useState({});
  
  // Get parent data from storage
  const getParentData = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      return user;
    } catch (err) {
      console.error('Error parsing user data:', err);
      return {};
    }
  };
  
  const parentData = getParentData();
  
  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Fetch course data and parent's kids
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !parentData.id) {
        navigate('/parents-dashboard');
        return;
      }
      
      setLoading(true);
      
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
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
        
        // Fetch parent's kids
        const kidsResponse = await fetch(`${baseUrl}/parents/${parentData.id}/kids`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (kidsResponse.ok) {
          const kids = await kidsResponse.json();
          setKidsData(kids);
          
          // Fetch enrollment data for all kids
          const enrollmentData = {};
          for (const kid of kids) {
            if (kid && kid.user_id) {
              try {
                const kidEnrollmentResponse = await fetch(`${baseUrl}/kids/${kid.user_id}/enrollments`, {
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                  }
                });
                
                if (kidEnrollmentResponse.ok) {
                  const kidEnrollments = await kidEnrollmentResponse.json();
                  enrollmentData[kid.user_id] = kidEnrollments.map(e => e.course_id);
                }
              } catch (err) {
                console.error(`Error fetching enrollments for kid ${kid.user_id}:`, err);
              }
            }
          }
          setEnrollments(enrollmentData);
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        toast.error(`Failed to load course: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, parentData.id, baseUrl, navigate]);
  
  // Handle course enrollment for a kid
  const handleEnrollKid = async (kidId, courseId) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const response = await fetch(`${baseUrl}/kids/${kidId}/enrollments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          course_id: courseId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to enroll: ${response.status}`);
      }

      // Update local enrollment data
      setEnrollments(prev => ({
        ...prev,
        [kidId]: [...(prev[kidId] || []), courseId]
      }));
      
      toast.success(`Successfully enrolled in the course!`);
    } catch (err) {
      console.error("Error enrolling in course:", err);
      toast.error(`Failed to enroll: ${err.message}`);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Menu baseUrl={baseUrl} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Menu baseUrl={baseUrl} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Course not found</p>
            <button 
              onClick={() => navigate('/parents-dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Menu baseUrl={baseUrl} />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate('/parents-dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>

          {/* Course header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="relative h-64">
              <img
                src={course.thumbnail || "https://images.unsplash.com/photo-1501594907352-04cda38ebc29"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <Star size={16} className="mr-1 text-yellow-400" />
                    {course.xp_value || 0} XP
                  </span>
                  <span className="flex items-center">
                    <BookOpen size={16} className="mr-1" />
                    {course.grade_level}
                  </span>
                  <span className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    {course.subject}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Course Description</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {course.description || "This course provides comprehensive learning materials and interactive content."}
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h3 className="font-medium text-gray-800">Instructor</h3>
                    <p className="text-gray-600">{course.instructor || "Nova Pioneers Team"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Created</h3>
                    <p className="text-gray-600">{formatDate(course.created_date)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrollment panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users size={20} className="mr-2" />
                  Enroll Your Kids
                </h3>
                
                {kidsData && kidsData.length > 0 ? (
                  <div className="space-y-3">
                    {kidsData.filter(kid => kid && kid.first_name).map((kid) => {
                      const isEnrolled = enrollments[kid.user_id]?.includes(Number(courseId));
                      return (
                        <div key={kid.user_id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {kid.first_name?.charAt(0)}{kid.last_name?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{kid.first_name} {kid.last_name}</p>
                              <p className="text-xs text-gray-500">{kid.title || "New Pioneer"}</p>
                            </div>
                          </div>
                          
                          {isEnrolled ? (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Enrolled
                            </span>
                          ) : (
                            <button
                              onClick={() => handleEnrollKid(kid.user_id, Number(courseId))}
                              className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700"
                            >
                              Enroll
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No kids found. Add a kid to your account first.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentCourseView;