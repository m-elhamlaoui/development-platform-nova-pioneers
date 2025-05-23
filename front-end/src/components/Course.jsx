import { motion } from "framer-motion";
import { Heart, User, ChevronDown, Award, BookOpen, FileText, Clock, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CourseCard({ course, index }) {
  const [isFav, setIsFav] = useState(false);
  
  const handleFavoriteToggle = () => setIsFav(!isFav);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      style={{maxWidth: "500px"}}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 text-black flex-grow"
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <div className="bg-white bg-opacity-90 rounded-md px-2 py-1 text-xs font-medium">
            {course.grade_level}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-16" />
      </div>
      
      <div className="p-5 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">{course.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>

        {/* Teacher Info */}
        <div className="flex items-center gap-2 mt-2">
          <div className="p-1 bg-[#0b3d91] rounded-full flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">Teacher: {course.instructor || "Undefined"}</span>
        </div>

        {/* Distinctive Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
            <BookOpen className="w-3 h-3 mr-1" />
            <span>{course.subject}</span>
          </div>
          
          <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium">
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{course.size_category || "Medium"}</span>
          </div>
          
          <div className="flex items-center bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-medium">
            <Award className="w-3 h-3 mr-1" />
            <span>{course.xp_value || 0} XP</span>
          </div>
        </div>

        {/* Course Metadata */}
        <div className="grid grid-cols-3 text-xs text-gray-500">
          <div className="flex flex-col">
            <span className="text-gray-400">Created</span>
            <span>{new Date(course.created_date).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Age</span>
            <span>{course.recommended_age || "All ages"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">Lessons</span>
            <span>{course.lessons?.length || 0}</span>
          </div>
        </div>
        
        {/* Rating and Child Links - Combined in one line */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <span key={i} className="text-[16px] text-amber-400">
                  {i < (course.rating || 4) ? "★" : "☆"}
                </span>
              ))}
            <span className="ml-1 text-xs text-slate-400">({course.reviews || 0} reviews)</span>
          </div>

          {/* Child Links Section - Preserved and enhanced */}
          <div className="flex gap-2 justify-end">
            <Link 
              to={`/child/1/${course.id}`} 
              className="flex items-center gap-1 bg-[#0b3d91] text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-800 transition-colors"
            >
              <Users size={10} className="flex-shrink-0" />
              child1
            </Link>
            <Link 
              to={`/child/2/${course.id}`} 
              className="flex items-center gap-1 border border-[#0b3d91] text-[#0b3d91] px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-50 transition-colors"
            >
              <Users size={10} className="flex-shrink-0" />
              child2
            </Link>
          </div>
        </div>
        
        {/* View Course Button */}
        <div className="pt-2">
          <Link 
            to={`/course/${course.id}`} 
            className="w-full block text-center bg-[#0b3d91] text-white py-2 rounded-full hover:bg-blue-800 transition-colors text-sm font-medium"
          >
            View Course
          </Link>
        </div>
      </div>
    </motion.div>
  );
}