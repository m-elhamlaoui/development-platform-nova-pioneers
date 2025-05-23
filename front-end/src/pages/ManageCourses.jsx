import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';

const CourseCard = ({ course, onEdit, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <motion.div
      className="card border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-md px-2 py-1 text-xs font-medium">
          {course.grade_level}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-marine-blue-700 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-3 line-clamp-3">{course.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-marine-blue-100 text-marine-blue-800 px-2 py-1 rounded text-xs">
            {course.subject}
          </span>
          <span className="bg-space-purple-100 text-space-purple-800 px-2 py-1 rounded text-xs">
            {course.size_category}
          </span>
          <span className="bg-cosmic-red-100 text-cosmic-red-800 px-2 py-1 rounded text-xs">
            {course.xp_value} XP
          </span>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <div>Created: {new Date(course.created_date).toLocaleDateString()}</div>
          <div>Recommended Age: {course.recommended_age}</div>
          <div>{course.lessons?.length || 0} Lessons</div>
        </div>

        {showConfirmDelete ? (
          <div className="mt-3 border-t pt-3">
            <p className="text-error-600 font-medium mb-2">Delete this course?</p>
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
                className="px-3 py-1 text-sm bg-error-600 hover:bg-error-700 text-white rounded transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between">
            <button
              onClick={() => onEdit(course)}
              className="bg-space-purple-600 text-white px-3 py-1 rounded hover:bg-space-purple-700 transition-colors text-sm"
            >
              Edit Course
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="text-error-600 hover:text-error-700 transition-colors text-sm"
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

  // Handle course edit (in a real app, this would navigate to an edit page or open a modal)
  const handleEditCourse = (course) => {
    console.log('Edit course:', course);
    // This would be replaced with actual edit functionality
    alert(`Editing ${course.title} (In a real app, this would open an edit form)`);
  };

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
        <Link to="/add-course" className="btn-primary">
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
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={handleEditCourse}
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
          <Link to="/add-course" className="btn-primary">
            Create Your First Course
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default ManageCourses;