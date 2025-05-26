import React, { useState, useEffect } from 'react';
import { Search, BellRing, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Course from './Course.jsx';
import { toast } from 'react-toastify';
import { get } from 'react-hook-form';
const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:9093' : 'http://http://141.144.226.68:9093'; // Replace with your actual production API URL
};

export default function ParentsMain({ kidsData, baseUrl = getApiBaseUrl() }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollments, setEnrollments] = useState({});
  const navigate = useNavigate();

  // Fetch all courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        // Real API call to get all courses
        const coursesResponse = await fetch(`${baseUrl}/courses`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!coursesResponse.ok) {
          throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
        }

        // Add error handling for JSON parsing
        let coursesData;
        try {
          const responseText = await coursesResponse.text();
          coursesData = JSON.parse(responseText);
          console.log("Fetched courses:", coursesData);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          // Use fallback data if JSON parsing fails
          coursesData = [
            {
              id: "1",
              title: "Introduction to Space Science",
              description: "Explore the wonders of our universe in this comprehensive introduction to space science.",
              thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
              grade_level: "Grade 5-8",
              subject: "Science",
              instructor: "Dr. Stella Nova",
              created_date: "2025-04-10T10:30:00Z",
              xp_value: 150
            },
            {
              id: "2",
              title: "Planets of Our Solar System",
              description: "Learn about the planets in our solar system and their unique characteristics.",
              thumbnail: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4",
              grade_level: "Grade 3-5",
              subject: "Astronomy",
              instructor: "Prof. Maria Luna",
              created_date: "2025-04-15T14:20:00Z",
              xp_value: 120
            },
            {
              id: "3",
              title: "Space Exploration History",
              description: "The fascinating journey of human space exploration from the first satellite to modern missions.",
              thumbnail: "https://images.unsplash.com/photo-1451187863213-d1bcbaae3fa3",
              grade_level: "Grade 6-9",
              subject: "History",
              instructor: "Dr. Neil Armstrong",
              created_date: "2025-04-20T09:15:00Z",
              xp_value: 180
            }
          ];
          toast.warn("Using sample course data due to API response format issues");
        }
        
        setCourses(coursesData);
        
        // Fetch enrollment data for all kids - FIXED with null checks
        if (kidsData && kidsData.length > 0) {
          const enrollmentData = {};
          
          for (const kid of kidsData) {
            // Skip null or invalid kids
            if (!kid || !kid.user_id) continue;
            
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
              // Continue with other kids even if one fails
            }
          }
          
          setEnrollments(enrollmentData);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [baseUrl, kidsData]);

  // Handle course enrollment for a specific kid
  const handleEnrollKid = async (kidId, courseId) => {
    if (!kidId) {
      toast.error("Invalid kid ID");
      return;
    }
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      // API call to enroll kid in course
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

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Custom CourseCard that includes child enrollment buttons - FIXED with null checks
  const CourseWithEnrollment = ({ course, index }) => {
    return (
      <Course 
        course={course} 
        index={index}
        onClick={() => navigate(`/course/${course.id}/view`)}
      >
        {/* Child enrollment buttons */}
        {kidsData && kidsData.length > 0 ? (
          <div className="pt-3 grid gap-2">
            {kidsData
              .filter(kid => kid !== null && kid !== undefined && kid.user_id)
              .map((kid) => {
                const isEnrolled = enrollments[kid.user_id]?.includes(course.id);
                return (
                  <button 
                    key={kid.user_id || Math.random()}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isEnrolled) {
                        handleEnrollKid(kid.user_id, course.id);
                      }
                    }}
                    className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isEnrolled 
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-[#0b3d91] text-white hover:bg-blue-800"
                    }`}
                    disabled={isEnrolled}
                  >
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#0b3d91]">
                        {kid.first_name?.charAt(0) || "?"}
                        {kid.last_name?.charAt(0) || ""}
                      </span>
                    </div>
                    {kid.first_name || "Unknown"} {isEnrolled ? "(Enrolled)" : "- Enroll"}
                  </button>
                );
              })}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500 py-2">
            Add children to enable enrollment
          </p>
        )}
      </Course>
    );
  };

  return (
    <div className='parents-main' style={{flexGrow: 1, minHeight: "100vh", padding: "1rem"}}>
      {/* Search container */}
      <div className="search-container flex items-center gap-2 bg-white p-3 rounded-xl shadow mb-6">
        <input 
          type="text" 
          className='search flex-grow outline-none border-none'
          placeholder='Search for a course...' 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Search className='search-icon text-gray-500' style={{cursor: "pointer"}} />
      </div>

      {/* Courses grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Available Courses</h2>
        {loading ? (
          <div className="text-center py-8">Loading courses...</div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseWithEnrollment key={course.id || index} course={course} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No courses match your search." : "No courses available at this time."}
          </div>
        )}
      </div>
    </div>
  );
}
