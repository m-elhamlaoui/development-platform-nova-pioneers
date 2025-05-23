import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  PieChart, 
  Award, 
  TrendingUp, 
  Plus, 
  BarChart2,
  ChevronRight,
  Clock,
  Users
} from 'lucide-react';

// Modern stat card with gradient background
const StatCard = ({ title, value, icon, color, gradientFrom, gradientTo }) => (
  <motion.div 
    className={`rounded-2xl p-6 shadow-lg relative overflow-hidden`}
    style={{
      background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
    }}
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{ 
      y: -5,
      boxShadow: '0 20px 30px rgba(0,0,0,0.15)',
      transition: { duration: 0.2 } 
    }}
  >
    {/* Decorative circles for background */}
    <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-white opacity-10"></div>
    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white opacity-10"></div>
    
    <div className="relative flex items-center justify-between z-10">
      <div>
        <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
      <div className="w-12 h-12 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center text-white">
        {icon}
      </div>
    </div>
  </motion.div>
);

// Stylish card for recent courses
const RecentCourseCard = ({ course, index }) => (
  <motion.div 
    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="relative h-32">
      <img 
        src={course.thumbnail} 
        alt={course.title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="text-white font-bold truncate">{course.title}</h3>
        <div className="flex items-center mt-1">
          <span className="bg-white/30 backdrop-blur-sm text-xs text-white rounded-full px-2 py-0.5 inline-flex items-center">
            <Clock size={10} className="mr-1" />
            {new Date(course.created_date).toLocaleDateString()}
          </span>
          <span className="bg-white/30 backdrop-blur-sm text-xs text-white rounded-full px-2 py-0.5 inline-flex items-center ml-2">
            <Users size={10} className="mr-1" />
            {course.grade_level}
          </span>
        </div>
      </div>
    </div>
    <div className="p-4">
      <p className="text-sm text-gray-600 line-clamp-2 h-10">{course.description}</p>
      <div className="mt-3 flex justify-between items-center">
        <div className="flex items-center text-xs font-medium">
          <FileText size={12} className="text-blue-500 mr-1" />
          <span>{course.lessons?.length || 0} lessons</span>
        </div>
        <Link 
          to={`/teachers/course/${course.id}`} 
          className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center"
        >
          View details <ChevronRight size={12} className="ml-1" />
        </Link>
      </div>
    </div>
  </motion.div>
);

// Action card with cool hover effects
const ActionCard = ({ icon, title, description, color, to }) => (
  <Link to={to}>
    <motion.div 
      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 h-full"
      whileHover={{ 
        scale: 1.03,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  </Link>
);

// XP Level Component (simplified)
const XpProgressCard = ({ xpStatus, totalXp }) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white opacity-10"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white opacity-10"></div>
      
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
            <Award size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-2xl">{xpStatus.level}</h3>
            <p className="text-white/70 text-sm">Educator Level</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-center">
        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium flex items-center gap-2">
          <div className="bg-white/30 p-1 rounded-full">
            <Award size={16} className="text-white" />
          </div>
          <span>{totalXp} XP</span>
        </span>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { courses, teacher, getXpLevel, calculateTotalXp } = useData();
  const [totalXp, setTotalXp] = useState(0);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    averageLessonsPerCourse: 0
  });

  useEffect(() => {
    // Calculate stats
    const coursesCount = courses.length;
    const lessonsCount = courses.reduce(
      (total, course) => total + (course.lessons?.length || 0), 
      0
    );
    
    setStats({
      totalCourses: coursesCount,
      totalLessons: lessonsCount,
      averageLessonsPerCourse: coursesCount > 0 
        ? (lessonsCount / coursesCount).toFixed(1) 
        : 0
    });
    
    // Calculate XP
    setTotalXp(calculateTotalXp() + teacher.xpPoints);
  }, [courses, teacher.xpPoints, calculateTotalXp]);

  const xpStatus = getXpLevel(totalXp);

  // Sort courses by created date (most recent first)
  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-6"
    >
      {/* Welcome Section with XP Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-md h-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full border-2 border-blue-500 p-1">
                <img 
                  src={teacher.avatar || "https://ui-avatars.com/api/?name=" + teacher.name} 
                  alt={teacher.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Welcome, {teacher.name}</h1>
                <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* XP Progress Card */}
        <div className="lg:col-span-1">
          <XpProgressCard xpStatus={xpStatus} totalXp={totalXp} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Courses" 
          value={stats.totalCourses} 
          icon={<BookOpen size={22} />} 
          gradientFrom="#4f46e5"
          gradientTo="#818cf8"
        />
        <StatCard 
          title="Total Lessons" 
          value={stats.totalLessons} 
          icon={<FileText size={22} />} 
          gradientFrom="#8b5cf6"
          gradientTo="#c084fc"
        />
        {/* <StatCard 
          title="Avg. Lessons/Course" 
          value={stats.averageLessonsPerCourse} 
          icon={<PieChart size={22} />} 
          gradientFrom="#ec4899"
          gradientTo="#f472b6"
        /> */}
        <StatCard 
          title="Total XP" 
          value={totalXp} 
          icon={<Award size={22} />} 
          gradientFrom="#f59e0b"
          gradientTo="#fbbf24"
        />
      </div>
      
      {/* Recent Courses */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Courses</h2>
          <Link to="/teachers/manage-courses" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
            View all <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCourses.map((course, index) => (
            <RecentCourseCard key={course.id} course={course} index={index} />
          ))}
          {recentCourses.length === 0 && (
            <motion.div 
              className="lg:col-span-3 bg-gray-50 rounded-xl p-10 text-center border border-dashed border-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No courses available</h3>
              <p className="text-gray-500 mb-4">Start creating your first educational course today!</p>
              <Link 
                to="/teachers/add-course" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className="mr-2" /> Create Course
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard 
            icon={<Plus size={24} className="text-white" />}
            title="Create New Course"
            description="Start building a new engaging course for your students"
            color="bg-gradient-to-br from-blue-500 to-blue-700"
            to="/teachers/add-course"
          />
          
          <ActionCard 
            icon={<BookOpen size={24} className="text-white" />}
            title="Manage Courses"
            description="Edit, update or remove your existing courses"
            color="bg-gradient-to-br from-purple-500 to-purple-700"
            to="/teachers/manage-courses"
          />
          
          {/* <ActionCard 
            icon={<BarChart2 size={24} className="text-white" />}
            title="View Analytics"
            description="Get insights about student engagement and progress"
            color="bg-gradient-to-br from-rose-500 to-rose-700"
            to="/teachers/analytics"
          /> */}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;