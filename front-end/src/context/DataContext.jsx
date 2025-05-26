import React, { createContext, useContext, useState, useEffect } from 'react';
import apiConfig from '../utils/apiConfig';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch logged in teacher (assuming teacherId in localStorage or similar)
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // For demo, using ID 1; in real app, get from auth context/localStorage
        const teacherId = localStorage.getItem('teacherId') || 1;
        const response = await fetch(`${apiConfig.teachers}/${teacherId}`);
        if (response.ok) {
          const data = await response.json();
          setTeacher(data);
        } else {
          console.error('Failed to fetch teacher data');
          // Fallback to demo data
          setTeacher({
            id: 1,
            username: "demo_teacher",
            email: "teacher@example.com",
            firstName: "Jane",
            lastName: "Doe",
            accumulatedXp: 1500,
            title: "Space Explorer"
          });
        }
      } catch (error) {
        console.error('Error fetching teacher:', error);
      }
    };
    
    fetchTeacherData();
  }, []);

  // Fetch courses for the current teacher
  useEffect(() => {
    const fetchCourses = async () => {
      if (!teacher?.id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${apiConfig.courses}/teacher/${teacher.id}`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          console.error('Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [teacher?.id]);
  
  // XP level calculation
  const getXpLevel = (xp) => {
    if (xp >= 10000) return { level: "Master Educator", color: "bg-purple-600" };
    if (xp >= 5000) return { level: "Senior Educator", color: "bg-indigo-600" };
    if (xp >= 2000) return { level: "Advanced Educator", color: "bg-blue-600" };
    if (xp >= 500) return { level: "Educator", color: "bg-green-600" };
    return { level: "Novice Educator", color: "bg-orange-500" };
  };
  
  // Add a course
  const addCourse = async (courseData) => {
    try {
      // API call happens in AddCourse.jsx
      setCourses([...courses, courseData]);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };
  
  // Update a course
  const updateCourse = (updatedCourse) => {
    setCourses(
      courses.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
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
    teacher,
    courses,
    loading,
    getXpLevel,
    addCourse,
    updateCourse,
    deleteCourse,
    calculateTotalXp
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);