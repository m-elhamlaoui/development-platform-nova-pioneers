import React, { createContext, useContext, useState, useEffect } from 'react';
import apiConfig from '../utils/apiConfig';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Move fetchCourses outside of useEffect so it can be reused
  const fetchCourses = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      console.log('Fetching courses - user data:', user);
      
      if (!user.id) {
        console.log('No user ID found for fetching courses');
        return;
      }
      
      const userRole = user.role ? user.role.toString().toLowerCase().trim() : '';
      if (userRole !== 'teacher') {
        console.log(`User role '${userRole}' is not 'teacher' for course fetching`);
        return;
      }

      console.log('Fetching courses for teacher user ID:', user.id);
      
      // Try different endpoints for fetching courses
      let response = await fetch(`${apiConfig.courses}/teacher/${user.id}`);
      
      if (!response.ok) {
        // Try by user_id if teacher ID lookup fails
        response = await fetch(`${apiConfig.courses}/by-teacher-user/${user.id}`);
      }
      
      const responseText = await response.text();
      console.log('Raw courses response:', responseText);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No courses found for teacher');
          setCourses([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }
      
      if (!responseText.trim()) {
        console.log('Empty courses response');
        setCourses([]);
        return;
      }
      
      let coursesData;
      try {
        coursesData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parsing failed for courses:', parseError);
        console.error('Response text:', responseText);
        setCourses([]);
        return;
      }
      
      console.log('Parsed courses data:', coursesData);
      
      // Handle different response formats
      if (Array.isArray(coursesData)) {
        setCourses(coursesData);
      } else if (coursesData.courses && Array.isArray(coursesData.courses)) {
        setCourses(coursesData.courses);
      } else if (coursesData.data && Array.isArray(coursesData.data)) {
        setCourses(coursesData.data);
      } else if (coursesData.success && coursesData.courses) {
        setCourses(Array.isArray(coursesData.courses) ? coursesData.courses : []);
      } else {
        console.warn('Unexpected courses response format:', coursesData);
        setCourses([]);
      }
      
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  // Fetch logged in teacher
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        console.log('Session storage user data:', user);
        console.log('User role:', user.role);
        console.log('User role type:', typeof user.role);
        
        // Debug: Check if user exists and has the right properties
        if (!user.id) {
          console.log('No user ID found in session');
          setLoading(false);
          return;
        }
        
        if (!user.role) {
          console.log('No role found in session');
          setLoading(false);
          return;
        }
        
        // Check for teacher role (case-insensitive and trim whitespace)
        const userRole = user.role.toString().toLowerCase().trim();
        console.log('Processed user role:', userRole);
        
        if (userRole !== 'teacher') {
          console.log(`User role '${userRole}' is not 'teacher'`);
          setLoading(false);
          return;
        }

        console.log('Fetching teacher data for user ID:', user.id);
        
        // Try the direct approach first
        let response = await fetch(`${apiConfig.teachers}/${user.id}`);
        
        if (!response.ok) {
          console.log(`Direct teacher lookup failed with status: ${response.status}`);
          
          // Try by-user endpoint
          response = await fetch(`${apiConfig.teachers}/by-user/${user.id}`);
          
          if (!response.ok) {
            console.log(`By-user lookup failed with status: ${response.status}`);
            
            // Try by email as last resort
            if (user.email) {
              console.log('Trying to fetch teacher by email:', user.email);
              response = await fetch(`${apiConfig.teachers}/by-email/${user.email}`);
              
              if (!response.ok) {
                console.error(`All teacher lookup methods failed. Last status: ${response.status}`);
                setLoading(false);
                return;
              }
            } else {
              console.error('No email available for fallback lookup');
              setLoading(false);
              return;
            }
          }
        }
        
        const responseText = await response.text();
        console.log('Raw teacher response:', responseText);
        
        if (!responseText.trim()) {
          console.error('Empty response from server');
          setLoading(false);
          return;
        }
        
        let teacherData;
        try {
          teacherData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parsing failed:', parseError);
          console.error('Response text:', responseText);
          setLoading(false);
          return;
        }
        
        console.log('Parsed teacher data:', teacherData);
        console.log('Teacher ID from database:', teacherData.id);
        setTeacher(teacherData);
        
      } catch (error) {
        console.error('Error fetching teacher:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeacherData();
  }, []);

  // Fetch courses for the current teacher - use the moved fetchCourses function
  useEffect(() => {
    // Only fetch courses after teacher data is loaded or if user role is confirmed
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userRole = user.role ? user.role.toString().toLowerCase().trim() : '';
    
    if (userRole === 'teacher' && user.id) {
      fetchCourses();
    }
  }, [teacher]); // Depend on teacher so courses fetch after teacher is loaded

  // XP level calculation
  const getXpLevel = (xp) => {
    if (xp >= 10000) return { level: "Master Educator", color: "bg-purple-600" };
    if (xp >= 5000) return { level: "Senior Educator", color: "bg-indigo-600" };
    if (xp >= 2000) return { level: "Advanced Educator", color: "bg-blue-600" };
    if (xp >= 1000) return { level: "Experienced Educator", color: "bg-teal-600" };
    if (xp >= 500) return { level: "Educator", color: "bg-green-600" };
    return { level: "Novice Educator", color: "bg-orange-500" };
  };
  
  // Add a course
  const addCourse = async (courseData) => {
    try {
      console.log('Adding course to context:', courseData);
      
      // Add to local state immediately for optimistic update
      setCourses(prevCourses => [...prevCourses, courseData]);
      
      // Refresh courses from backend to ensure consistency
      await fetchCourses();
      
    } catch (error) {
      console.error('Error in addCourse:', error);
      // If there's an error, refresh courses to get the actual state
      await fetchCourses();
    }
  };
  
  // Update a course
  const updateCourse = async (updatedCourse) => {
    try {
      console.log('Updating course in context:', updatedCourse);
      
      // Update local state immediately
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );
      
      // Refresh courses from backend to ensure consistency
      await fetchCourses();
      
    } catch (error) {
      console.error('Error in updateCourse:', error);
      // If there's an error, refresh courses to get the actual state
      await fetchCourses();
    }
  };
  
  // Delete a course
  const deleteCourse = async (courseId) => {
    try {
      const response = await fetch(`${apiConfig.courses}/${courseId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setCourses(courses.filter(course => course.id !== courseId));
      } else {
        console.error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };
  
  // Calculate total XP
  const calculateTotalXp = () => {
    return courses.reduce((total, course) => total + (course.xp_value || 0), 0);
  };
  
  const value = {
    courses,
    teacher,
    loading,
    addCourse,
    updateCourse,
    deleteCourse,
    getXpLevel,
    calculateTotalXp,
    fetchCourses // Export fetchCourses so it can be called manually if needed
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);