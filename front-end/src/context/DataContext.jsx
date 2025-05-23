import { createContext, useState, useContext, useEffect } from 'react';
import { mockCourses } from '../data/mockData';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [teacher, setTeacher] = useState({
    id: '1',
    name: 'Dr. Stella Nova',
    email: 'stella.nova@spaceedu.com',
    avatar: 'https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-buzz-aldrin-41162.jpeg',
    xpPoints: 1250,
    joinDate: '2023-04-15'
  });

  useEffect(() => {
    // Simulate loading data from an API
    setCourses(mockCourses);
  }, []);

  // Calculate XP level based on points
  const getXpLevel = (points) => {
    if (points < 500) return { level: 'Beginner', color: 'bg-green-500' };
    if (points < 1000) return { level: 'Intermediate', color: 'bg-blue-500' };
    if (points < 1500) return { level: 'Advanced', color: 'bg-purple-500' };
    if (points < 2000) return { level: 'Great', color: 'bg-yellow-500' };
    return { level: 'Super', color: 'bg-cosmic-red-600' };
  };

  // Add a new course
  const addCourse = (course) => {
    const newCourse = {
      ...course,
      id: `course-${Date.now()}`,
      created_date: new Date().toISOString(),
    };
    setCourses([...courses, newCourse]);
    return newCourse;
  };

  // Update an existing course
  const updateCourse = (updatedCourse) => {
    setCourses(
      courses.map((course) => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  // Delete a course
  const deleteCourse = (courseId) => {
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  // Calculate total XP from all courses
  const calculateTotalXp = () => {
    return courses.reduce((total, course) => total + (course.xp_value || 0), 0);
  };

  const value = {
    courses,
    teacher,
    getXpLevel,
    addCourse,
    updateCourse,
    deleteCourse,
    calculateTotalXp,
    setTeacher,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};