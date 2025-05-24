import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate import
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Heart, User, ChevronDown, Award, BookOpen } from "lucide-react";

const CourseCard = ({ course, onEdit, onDelete, index }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const navigate = useNavigate(); // Add useNavigate hook

  const handleFavoriteToggle = () => setIsFav(!isFav);

  // Function to handle edit - navigate to AddCourse with state
  const handleEdit = () => {
    navigate('/teachers/add-course', { 
      state: { 
        isEditing: true,
        courseData: course 
      } 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ maxWidth: "500px" }}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 text-black flex-grow"
      layout
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

        {/* Rating */}
        <div className="rating-kids flex justify-between items-center">
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
        </div>

        {/* Delete confirmation or action buttons */}
        {showConfirmDelete ? (
          <div className="mt-3 border-t pt-3">
            <p className="text-red-600 font-medium mb-2">Delete this course?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(course.id);
                  setShowConfirmDelete(false);
                }}
                className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between mt-4">
            <button
              onClick={handleEdit} // Use our new handleEdit function
              className="bg-[#0b3d91] text-white px-4 py-1.5 rounded-full hover:bg-blue-800 transition-colors text-sm font-medium"
            >
              Edit Course
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="text-red-600 hover:text-red-700 transition-colors text-sm font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ManageCourses = () => {
  const { courses, deleteCourse } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [sortBy, setSortBy] = useState('created_date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Get unique subjects and grade levels for filters
  const subjects = [...new Set(courses.map(course => course.subject))];
  const gradeLevels = [...new Set(courses.map(course => course.grade_level))];

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = filterGrade ? course.grade_level === filterGrade : true;
      const matchesSubject = filterSubject ? course.subject === filterSubject : true;
      return matchesSearch && matchesGrade && matchesSubject;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'xp_value') {
        return sortOrder === 'asc'
          ? a.xp_value - b.xp_value
          : b.xp_value - a.xp_value;
      } else {
        // Default: created_date
        return sortOrder === 'asc'
          ? new Date(a.created_date) - new Date(b.created_date)
          : new Date(b.created_date) - new Date(a.created_date);
      }
    });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Courses</h1>
        <Link to="/teachers/add-course" className="btn-primary">
          + Add New Course
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by title or description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
            >
              <option value="">All Grade Levels</option>
              {gradeLevels.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created_date">Date Created</option>
              <option value="title">Title</option>
              <option value="xp_value">XP Value</option>
            </select>
            <button
              className="p-2 border border-gray-300 rounded-md bg-white"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          <div className="text-sm text-gray-600 mt-2 md:mt-0">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        </div>
      </div>

      {/* Course List */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                onDelete={deleteCourse}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300"
        >
          <p className="text-gray-500 mb-4">No courses match your filters.</p>
          <Link to="/teachers/add-course" className="btn-primary">
            Create Your First Course
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default ManageCourses;