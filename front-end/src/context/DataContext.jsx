import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Initialize with default values to prevent undefined errors
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState({
    xpPoints: 0,
    level: 1,
    name: '',
    username: '',
    email: '',
  });

  // Sample teacher data for testing (replace with your API call)
  useEffect(() => {
    // Simulate loading teacher data
    const loadTeacherData = () => {
      const mockTeacherData = {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@novapioneer.edu",
        xpPoints: 1850,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format", // Professional teacher avatar
        id: 1
      };
      
      setTeacher(mockTeacherData);
    };

    // Simulate loading courses data with space-related images
    const loadCoursesData = () => {
      const mockCourses = [
        {
          id: 1,
          title: "Journey to the Stars",
          description: "Embark on an incredible journey through our solar system and beyond. Learn about planets, stars, and the mysteries of deep space.",
          thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop&auto=format", // Beautiful space image
          created_date: new Date().toISOString(),
          grade_level: "Elementary",
          lessons: [
            { id: 1, title: "What is Space?" },
            { id: 2, title: "The Solar System" },
            { id: 3, title: "Stars and Constellations" }
          ]
        },
        {
          id: 2,
          title: "Planets and Moons",
          description: "Discover the fascinating worlds in our solar system. From rocky planets to gas giants, each has unique characteristics.",
          thumbnail: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=300&fit=crop&auto=format", // Planets image
          created_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          grade_level: "Middle School",
          lessons: [
            { id: 4, title: "Inner Planets" },
            { id: 5, title: "Gas Giants" },
            { id: 6, title: "Moons and Asteroids" },
            { id: 7, title: "Dwarf Planets" }
          ]
        },
        {
          id: 3,
          title: "Space Exploration",
          description: "Learn about humanity's greatest adventure - exploring space! From the first rockets to Mars missions.",
          thumbnail: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&h=300&fit=crop&auto=format", // Space shuttle/rocket
          created_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          grade_level: "High School",
          lessons: [
            { id: 8, title: "History of Space Flight" },
            { id: 9, title: "Moon Landing" },
            { id: 10, title: "Space Stations" },
            { id: 11, title: "Mars Exploration" },
            { id: 12, title: "Future Missions" }
          ]
        },
        {
          id: 4,
          title: "Galaxies and Universe",
          description: "Explore the vast cosmos beyond our solar system. Learn about galaxies, black holes, and the structure of the universe.",
          thumbnail: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop&auto=format", // Galaxy image
          created_date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          grade_level: "High School",
          lessons: [
            { id: 13, title: "The Milky Way" },
            { id: 14, title: "Other Galaxies" },
            { id: 15, title: "Black Holes" },
            { id: 16, title: "Dark Matter" }
          ]
        },
        {
          id: 5,
          title: "Space Technology",
          description: "Discover the amazing technology that makes space exploration possible. From rockets to satellites and space suits.",
          thumbnail: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&auto=format", // Space technology
          created_date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
          grade_level: "Middle School",
          lessons: [
            { id: 17, title: "Rocket Science" },
            { id: 18, title: "Satellites" },
            { id: 19, title: "Space Suits" }
          ]
        }
      ];
      
      setCourses(mockCourses);
    };

    // Load data with a small delay to simulate API calls
    const timer = setTimeout(() => {
      loadTeacherData();
      loadCoursesData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // XP Level calculation function
  const getXpLevel = (xp) => {
    if (xp >= 2000) return { level: "Space Master", color: "bg-red-500" };
    if (xp >= 1500) return { level: "Astronaut", color: "bg-purple-500" };
    if (xp >= 1000) return { level: "Space Explorer", color: "bg-blue-500" };
    if (xp >= 500) return { level: "Cadet", color: "bg-green-500" };
    if (xp >= 100) return { level: "Rookie", color: "bg-yellow-500" };
    return { level: "Earth Dweller", color: "bg-gray-400" };
  };

  // Calculate total XP from courses
  const calculateTotalXp = () => {
    return courses.reduce((total, course) => {
      return total + (course.lessons?.length || 0) * 15; // 15 XP per lesson
    }, 0);
  };

  // Safe user update function
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  // Update teacher function
  const updateTeacher = (teacherData) => {
    setTeacher(prevTeacher => ({
      ...prevTeacher,
      ...teacherData
    }));
  };

  const contextValue = {
    // Teacher data
    teacher,
    setTeacher: updateTeacher,
    
    // Courses data
    courses,
    setCourses,
    
    // User data (for compatibility)
    user,
    setUser: updateUser,
    
    // Utility functions
    getXpLevel,
    calculateTotalXp,
    
    // Loading states
    isLoading: !teacher, // Consider loaded when teacher data is available
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export { DataContext };