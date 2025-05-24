import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Clock, User, CheckCircle } from 'lucide-react';

const EnrolledCourseCard = ({ course, index }) => {
  const formattedDate = new Date(course.lastAccessed).toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-44 object-cover"
        />
        <div className="absolute top-3 right-3">
          <div className="bg-white bg-opacity-90 rounded-md px-2 py-1 text-xs font-medium">
            {course.grade_level}
          </div>
        </div>
        
        {/* Progress Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-3 px-4">
          <div className="flex justify-between items-center text-white text-sm mb-1">
            <span className="font-medium">Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="h-1.5 bg-white/30 rounded-full">
            <div 
              className={`h-1.5 rounded-full ${
                course.progress >= 100 
                  ? 'bg-green-500' 
                  : 'bg-blue-500'
              }`}
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{course.title}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Clock size={14} className="mr-1" />
          <span className="mr-3">Last accessed: {formattedDate}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
            <BookOpen className="w-3 h-3 mr-1" />
            <span>{course.subject}</span>
          </div>
          
          <div className="flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
            <User className="w-3 h-3 mr-1" />
            <span>{course.instructor || "Unknown"}</span>
          </div>
          
          <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs">
            <Award className="w-3 h-3 mr-1" />
            <span>{course.xp_value || 0} XP</span>
          </div>
        </div>
        
        {/* Status */}
        {course.progress >= 100 ? (
          <div className="flex items-center text-green-600 text-sm mb-4">
            <CheckCircle size={16} className="mr-1" />
            <span>Course completed!</span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <span>
              {course.lessons?.length ? `${Math.round(course.progress / 100 * course.lessons.length)} of ${course.lessons.length} lessons completed` : 'In progress'}
            </span>
          </div>
        )}
        
        {/* Action button */}
        <Link
          to={`/course/${course.id}`}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition-colors font-medium"
        >
          {course.progress === 0 ? 'Start Learning' : (course.progress >= 100 ? 'Review Course' : 'Continue Learning')}
        </Link>
      </div>
    </motion.div>
  );
};

export default EnrolledCourseCard;