import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, Award, Clock } from 'lucide-react';

export default function CourseCard({ course, index, isParentDashboard, onClick, children }) {
  const [isFav, setIsFav] = useState(false);
  const location = useLocation();
  
  // Check if we're in the kid dashboard
  const isKidDashboard = location.pathname.includes('/kid/'); 
  
  // Use explicit prop if provided, otherwise use the path detection
  const showChildLinks = isParentDashboard !== undefined ? isParentDashboard : !isKidDashboard;
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  // Default image if thumbnail is missing
  const fallbackImage = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      style={{maxWidth: "500px"}}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 text-black flex-grow cursor-pointer flex flex-col"
      onClick={handleCardClick}
    >
      {/* Course Thumbnail */}
      <div className="relative w-full h-48">
        <img 
          src={course.thumbnail || fallbackImage} 
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = fallbackImage }}
        />
        <div className="absolute top-0 right-0 p-2">
          {course.xp_value && (
            <div className="bg-amber-500 text-white px-2 py-1 rounded-lg text-sm font-bold flex items-center">
              <Award className="w-4 h-4 mr-1" /> 
              {course.xp_value} XP
            </div>
          )}
        </div>
      </div>
      
      {/* Course Content */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{course.title}</h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>
        
        {/* Course Details */}
        <div className="flex flex-wrap gap-2 mb-3">
          {course.grade_level && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {course.grade_level}
            </span>
          )}
          {course.subject && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
              {course.subject}
            </span>
          )}
          {course.size_category && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {course.size_category}
            </span>
          )}
        </div>
        
        {/* Instructor & Rating */}
        <div className="mt-auto">
          {course.instructor && (
            <p className="text-gray-700 text-sm mb-2">
              <span className="font-medium">Instructor:</span> {course.instructor}
            </p>
          )}
          
          {course.rating && (
            <div className="flex items-center">
              <div className="flex text-amber-400 mr-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    fill={star <= Math.round(course.rating) ? "currentColor" : "none"}
                    className={star <= Math.round(course.rating) ? "text-amber-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {course.rating.toFixed(1)} ({course.reviews || 0} reviews)
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Divider for enrollment buttons */}
      {children && <hr className="border-gray-100" />}
      
      {/* Child elements (enrollment buttons) */}
      <div className="px-4 pb-4">
        {children}
      </div>
    </motion.div>
  );
}