import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Award, 
  Grid, 
  ChevronDown, 
  Settings, 
  LogOut, 
  Sparkles,
  BookMarked
} from 'lucide-react';
import { useData } from '../context/DataContext';
import KidSidebar from '../components/KidSidebar';
import CourseCard from '../components/Course';
import EnrolledCourseCard from '../components/EnrolledCourseCard';

const KidDashboard = () => {
  const { courses } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    subject: '',
    gradeLevel: '',
    ageRange: '',
  });
  
  // Mock enrolled courses for now (will come from backend later)
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  
  // Mock kid data (will come from auth context later)
  const kidData = {
    name: "Alex Johnson",
    title: "Space Explorer",
    avatarUrl: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=125&q=80",
    totalXp: 450,
    level: 3,
  };
  
  useEffect(() => {
    // Simulation of fetching enrolled courses
    // This will be replaced with actual API calls
    if (courses && courses.length > 0) {
      // For demonstration, set the first 2 courses as enrolled with random progress
      const mockEnrolled = courses.slice(0, 2).map(course => ({
        ...course,
        progress: Math.floor(Math.random() * 100),
        lastAccessed: new Date().toISOString()
      }));
      
      setEnrolledCourses(mockEnrolled);
    }
  }, [courses]);
  
  // Filter courses based on search query and filters
  const filteredCourses = courses?.filter(course => {
    // Search filter
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Subject filter
    if (filters.subject && course.subject !== filters.subject) {
      return false;
    }
    
    // Grade level filter
    if (filters.gradeLevel && course.grade_level !== filters.gradeLevel) {
      return false;
    }
    
    // Age range filter
    if (filters.ageRange && course.recommended_age !== filters.ageRange) {
      return false;
    }
    
    return true;
  });
  
  // Generate unique filter options from available courses
  const filterOptions = {
    subjects: [...new Set(courses?.map(course => course.subject) || [])],
    gradeLevels: [...new Set(courses?.map(course => course.grade_level) || [])],
    ageRanges: [...new Set(courses?.map(course => course.recommended_age) || [])],
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      subject: '',
      gradeLevel: '',
      ageRange: '',
    });
    setSearchQuery('');
  };
  
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Kid Sidebar */}
      <KidSidebar kidData={kidData} />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="mr-5 hidden md:block">
                  <Sparkles size={48} className="text-yellow-300" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {kidData.name}!</h1>
                  <p className="text-blue-100 mt-1">Continue your learning adventure</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-300" />
                    <span className="font-bold">{kidData.totalXp} XP</span>
                    <span className="mx-2 text-blue-200">|</span>
                    <span>{kidData.title}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/course')}
                  className="bg-white text-blue-700 hover:bg-blue-50 mt-3 px-4 py-2 rounded-lg font-medium flex items-center text-sm transition-colors"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Learning
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Course Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center ${
                  activeTab === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4 mr-2" />
                All Courses
              </button>
              
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center ${
                  activeTab === 'enrolled' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BookMarked className="w-4 h-4 mr-2" />
                My Courses
              </button>
            </div>
            
            {/* Search & Filter */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="bg-white border border-gray-200 p-2 rounded-lg hover:bg-gray-100"
              >
                <Filter className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
          
          {/* Filters Section */}
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white rounded-xl p-5 mb-6 shadow-md border border-gray-100"
            >
              <div className="flex flex-wrap justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset all
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={filters.subject}
                    onChange={(e) => setFilters({...filters, subject: e.target.value})}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md"
                  >
                    <option value="">All Subjects</option>
                    {filterOptions.subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                {/* Grade Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade Level
                  </label>
                  <select
                    value={filters.gradeLevel}
                    onChange={(e) => setFilters({...filters, gradeLevel: e.target.value})}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md"
                  >
                    <option value="">All Grades</option>
                    {filterOptions.gradeLevels.map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                
                {/* Age Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Range
                  </label>
                  <select
                    value={filters.ageRange}
                    onChange={(e) => setFilters({...filters, ageRange: e.target.value})}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md"
                  >
                    <option value="">All Ages</option>
                    {filterOptions.ageRanges.map((age) => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Course Grid */}
          {activeTab === 'all' ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Courses</h2>
              {filteredCourses && filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <CourseCard key={course.id} course={course} index={index} isParentDashboard={false} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-gray-400 mb-4">
                    <BookOpen size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700">No courses found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Enrolled Courses</h2>
              {enrolledCourses && enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course, index) => (
                    <CourseCard 
                      key={course.id} 
                      course={{...course, enrolled: true}} 
                      index={index} 
                      isParentDashboard={false} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-xl p-8 shadow-md">
                  <div className="text-gray-400 mb-4">
                    <BookMarked size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700">No enrolled courses yet</h3>
                  <p className="text-gray-500 mt-2">Explore our catalog and enroll in courses that interest you!</p>
                  <button 
                    onClick={() => setActiveTab('all')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KidDashboard;