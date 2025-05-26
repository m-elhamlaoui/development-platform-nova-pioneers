import React, { useState, useEffect } from 'react';
import { Search, BellRing, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import container from "../assets/hell-cont.png";
import Course from './Course.jsx';
import { toast } from 'react-toastify';

export default function ParentsMain({ parentData, kidsData, onToggleRestriction, baseUrl = "http://localhost:9093" }) {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeKidId, setActiveKidId] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [enrollments, setEnrollments] = useState({});
  const navigate = useNavigate();

  // Set the first kid as active by default if available
  useEffect(() => {
    if (kidsData && kidsData.length > 0 && !activeKidId) {
      // Find the first non-null kid with a valid user_id
      const validKid = kidsData.find(kid => kid && kid.user_id);
      if (validKid) {
        setActiveKidId(validKid.user_id);
      }
    }
  }, [kidsData, activeKidId]);

  // Fetch recent courses from the backend
  useEffect(() => {
    const fetchRecentCourses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        // Real API call to get recent courses
        const coursesResponse = await fetch(` http://localhost:9093/courses?limit=3`, {
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
          console.log("Raw API response:", responseText);
          coursesData = JSON.parse(responseText);
          console.log("Parsed courses data:", coursesData);
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
        
        setRecentCourses(coursesData);
        
        // Fetch enrollment data for all kids to know which are already enrolled
        if (kidsData && kidsData.length > 0) {
          const enrollmentData = {};
          
          for (const kid of kidsData) {
            // Skip null or undefined kids or kids without user_id
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
              console.error(`Error fetching enrollments for kid ID ${kid.user_id}:`, err);
              // Continue with other kids even if one fails
            }
          }
          
          setEnrollments(enrollmentData);
        }
      } catch (err) {
        console.error("Error fetching recent courses:", err);
        toast.error("Failed to load recent courses");
        
        // Use fallback data if API call fails
        setRecentCourses([
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCourses();
  }, [baseUrl, kidsData]);

  // Fetch enrolled courses for the active kid
  useEffect(() => {
    const fetchCoursesForKid = async () => {
      if (!activeKidId) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        // Real API call to get kid enrollments
        const enrollmentsResponse = await fetch(`${baseUrl}/kids/${activeKidId}/enrollments`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!enrollmentsResponse.ok) {
          throw new Error(`Failed to fetch enrollments: ${enrollmentsResponse.status}`);
        }

        const enrollmentsData = await enrollmentsResponse.json();
        setCourseList(enrollmentsData);
      } catch (err) {
        console.error("Error fetching courses:", err);
        toast.error(`Failed to load courses: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesForKid();
  }, [activeKidId, baseUrl]);

  // Handle course enrollment for a specific kid
  const handleEnrollKid = async (kidId, courseId) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      // Real API call to enroll kid
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
      
      // Refresh courses if this kid is active
      if (kidId === activeKidId) {
        const updatedCoursesResponse = await fetch(`${baseUrl}/kids/${activeKidId}/enrollments`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (updatedCoursesResponse.ok) {
          const updatedCourses = await updatedCoursesResponse.json();
          setCourseList(updatedCourses);
        }
      }
    } catch (err) {
      console.error("Error enrolling in course:", err);
      toast.error(`Failed to enroll: ${err.message}`);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Custom CourseCard that includes child enrollment buttons
  const ParentCourseCard = ({ course, index }) => {
    return (
      <Course 
        course={course} 
        index={index} 
        isParentDashboard={false}
        onClick={() => navigate(`/course/${course.id}/view`)}
      >
        {/* Custom child enrollment buttons with null checks */}
        <div className="pt-3 grid gap-2">
          {kidsData && kidsData.filter(kid => kid && kid.first_name && kid.last_name).map((kid) => {
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
      </Course>
    );
  };

  return (
    <div className='parents-main' style={{flexGrow: 1, minHeight: "100vh"}}>
      <div
        className="dashboard-hello relative h-[180px] mx-auto my-4 rounded-2xl text-white flex flex-col justify-center px-6 sm:px-10 shadow-md overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(11, 61, 145, 0.9), rgba(11, 61, 145, 0.5)), url(${container})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <p className="text-sm uppercase tracking-wider font-medium text-white/80 mb-1">
          Online Courses
        </p>
        <p className="text-xl sm:text-2xl font-semibold leading-snug">
          Welcome, {parentData?.first_name || "Parent"} <br />
          Monitor your children's progress
        </p>
      </div>
      
      {/* Alert section */}
      <div className="alerts-admin flex justify-center items-center">
        <div className="admin-alert flex justify-center items-center gap-3 w-[fit-content] shadow px-5 py-2 rounded-xl">
          <div className="bell-container flex justify-center items-center rounded-[50px] p-4 w-[fit-content]" style={{background: "rgba(112, 45, 255, 0.2)"}}>
            <BellRing className='text-[#0B3D91] cursor-pointer'></BellRing>
          </div>
          <div className="alert-info">
            <div className="a-title font-semibold">Administrator</div>
            <div className="a-subject font-medium">Your dashboard is ready!</div>
          </div>
        </div>
      </div>

      {/* Recent Courses Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">Loading courses...</div>
          ) : recentCourses.length > 0 ? (
            recentCourses.map((course, index) => (
              <ParentCourseCard key={course.id} course={course} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No courses available at this time.
            </div>
          )}
        </div>
      </div>
      
      {/* Kids section with improved table styling */}
      <div className="kids-sec-dashboard flex items-center justify-center bg-white my-3 shadow-xl rounded p-3 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <table className='text-m w-full border-collapse'>
          <thead>
            <tr className='font-bold border-b border-gray-200'>
              <th className="text-left px-4 py-3">Kid's Name and Date</th>
              <th className="text-center px-4 py-3">Title</th>
              <th className="text-center px-4 py-3">Accumulated XP</th>
              {/* <th className="text-center px-4 py-3">Restrictions</th>
              <th className="text-center px-4 py-3">View Courses</th> */}
            </tr>
          </thead>
          <tbody>
            {kidsData && kidsData.length > 0 ? (
              kidsData.filter(kid => kid && kid.first_name).map((kid) => (
                <tr key={kid.user_id || Math.random()} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className='flex items-center gap-3 px-4 py-3'>
                    <div className="p-2 bg-[#0b3d91] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="infos-kid-container">
                      <p className="font-semibold text-sm">{kid.first_name || ""} {kid.last_name || ""}</p>
                      <p className="text-xs text-gray-500">Born: {formatDate(kid.birth_date)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-3 py-1 ${
                      kid.title === "Space Newby" ? "bg-gray-400" :
                      kid.title === "Explorer" ? "bg-green-400" :
                      kid.title === "Astronaut" ? "bg-black" :
                      "bg-blue-400"
                    } text-white rounded-xl font-medium`}>
                      {kid.title || "Space Newby"}
                    </span>
                  </td>
                  <td className='font-bold text-[#69ebb7] px-4 py-3 text-center'>{kid.total_xp || 0} XP</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No kids found. Add a kid to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}