import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

const StatCard = ({ title, value, icon, color }) => (
  <motion.div 
    className="card"
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white text-xl mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </motion.div>
);

const RecentCourseCard = ({ course }) => (
  <motion.div 
    className="card flex"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
      <img 
        src={course.thumbnail} 
        alt={course.title} 
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-marine-blue-600">{course.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
      <div className="mt-2 flex items-center text-xs text-gray-500">
        <span className="mr-3">{course.grade_level}</span>
        <span>{course.lessons?.length || 0} lessons</span>
      </div>
    </div>
  </motion.div>
);

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
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {teacher.name}! You are a <span className={`font-semibold ${xpStatus.color} text-white px-2 py-1 rounded-full`}>
            {xpStatus.level}
          </span> level educator.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Courses" 
          value={stats.totalCourses} 
          icon="📚" 
          color="bg-marine-blue-600"
        />
        <StatCard 
          title="Total Lessons" 
          value={stats.totalLessons} 
          icon="📝" 
          color="bg-space-purple-600"
        />
        <StatCard 
          title="Avg. Lessons/Course" 
          value={stats.averageLessonsPerCourse} 
          icon="📊" 
          color="bg-cosmic-red-600"
        />
        <StatCard 
          title="Total XP" 
          value={totalXp} 
          icon="🏆" 
          color="bg-yellow-500"
        />
      </div>

      {/* Recent Courses */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCourses.map(course => (
            <RecentCourseCard key={course.id} course={course} />
          ))}
          {recentCourses.length === 0 && (
            <p className="text-gray-500">No courses available. Create your first course!</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.a 
            href="/add-course"
            className="card bg-marine-blue-50 border border-marine-blue-100 flex items-center p-4 hover:bg-marine-blue-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl mr-3">➕</span>
            <span className="font-medium text-marine-blue-700">Create New Course</span>
          </motion.a>
          
          <motion.a 
            href="/teachers/manage-courses"
            className="card bg-space-purple-50 border border-space-purple-100 flex items-center p-4 hover:bg-space-purple-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl mr-3">📚</span>
            <span className="font-medium text-space-purple-700">Manage Existing Courses</span>
          </motion.a>
          
          <motion.button 
            className="card bg-cosmic-red-50 border border-cosmic-red-100 flex items-center p-4 hover:bg-cosmic-red-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl mr-3">📊</span>
            <span className="font-medium text-cosmic-red-700">View Detailed Analytics</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;