import { createContext, useContext, useState, useEffect } from 'react';
import { mockCourses } from '../data/mockData';

// Create context
const DataContext = createContext(null);

// Create provider component
export function DataProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data fetching with mock data
    setTimeout(() => {
      // Add enrolled property to some courses for testing
      const coursesWithEnrollmentStatus = mockCourses.map((course, index) => ({
        ...course,
        // Just for demo: mark every other course as enrolled
        enrolled: index % 2 === 0,
        // Add random progress for enrolled courses
        progress: index % 2 === 0 ? Math.floor(Math.random() * 80) + 10 : 0
      }));
      setCourses(coursesWithEnrollmentStatus);
      setLoading(false);
    }, 500);
  }, []);
  
  const value = {
    courses,
    loading
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Custom hook
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}