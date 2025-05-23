import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import DraggableLessonList from '../components/DragDrop/DraggableLessonList';
import ImageUpload from '../components/FileUpload/ImageUpload';

const AddCourse = () => {
  const navigate = useNavigate();
  const { addCourse } = useData();
  const [lessons, setLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [thumbnail, setThumbnail] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmitDetails = (data) => {
    const newCourse = {
      ...data,
      thumbnail,
      xp_value: parseInt(data.xp_value),
      lessons
    };
    
    addCourse(newCourse);
    navigate('/manage-courses');
  };
  
  const addLesson = () => {
    setLessons([
      ...lessons, 
      {
        id: `lesson-${Date.now()}`,
        title: 'New Lesson',
        content: '',
        resource_links: [],
        sequence_order: lessons.length + 1,
        lesson_contents: []
      }
    ]);
  };
  
  const updateLesson = (updatedLesson) => {
    setLessons(
      lessons.map((lesson) => 
        lesson.id === updatedLesson.id ? updatedLesson : lesson
      )
    );
  };
  
  const removeLesson = (lessonId) => {
    setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
  };
  
  const handleReorder = (reorderedLessons) => {
    // Update sequence_order based on new order
    const updatedLessons = reorderedLessons.map((lesson, index) => ({
      ...lesson,
      sequence_order: index + 1
    }));
    
    setLessons(updatedLessons);
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 font-medium ${activeTab === 'details' ? 'text-marine-blue-600 border-b-2 border-marine-blue-600' : 'text-gray-500 hover:text-marine-blue-600'}`}
          onClick={() => setActiveTab('details')}
        >
          Course Details
        </button>
        <button
          className={`py-3 px-6 font-medium ${activeTab === 'lessons' ? 'text-marine-blue-600 border-b-2 border-marine-blue-600' : 'text-gray-500 hover:text-marine-blue-600'}`}
          onClick={() => setActiveTab('lessons')}
        >
          Lessons
        </button>
      </div>
      
      {/* Course Details Form */}
      <AnimatePresence mode="wait">
        {activeTab === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form className="card space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Thumbnail</label>
                <ImageUpload
                  value={thumbnail}
                  onChange={setThumbnail}
                  className="mb-4"
                />
                {!thumbnail && (
                  <p className="text-error-600 text-sm mt-1">Thumbnail is required</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <p className="text-error-600 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    {...register("grade_level", { required: "Grade level is required" })}
                  >
                    <option value="">Select Grade Level</option>
                    <option value="Elementary">Elementary</option>
                    <option value="Middle School">Middle School</option>
                    <option value="High School">High School</option>
                    <option value="College">College</option>
                  </select>
                  {errors.grade_level && (
                    <p className="text-error-600 text-sm mt-1">{errors.grade_level.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register("description", { required: "Description is required" })}
                ></textarea>
                {errors.description && (
                  <p className="text-error-600 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    {...register("subject", { required: "Subject is required" })}
                  >
                    <option value="">Select Subject</option>
                    <option value="Astronomy">Astronomy</option>
                    <option value="Astrophysics">Astrophysics</option>
                    <option value="Space Exploration">Space Exploration</option>
                    <option value="Planetary Science">Planetary Science</option>
                    <option value="Cosmology">Cosmology</option>
                    <option value="History of Science">History of Science</option>
                    <option value="Science">Science</option>
                  </select>
                  {errors.subject && (
                    <p className="text-error-600 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size Category</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    {...register("size_category", { required: "Size category is required" })}
                  >
                    <option value="">Select Size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                  {errors.size_category && (
                    <p className="text-error-600 text-sm mt-1">{errors.size_category.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">XP Value</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    {...register("xp_value", { 
                      required: "XP value is required",
                      min: { value: 50, message: "Minimum XP is 50" },
                      max: { value: 500, message: "Maximum XP is 500" }
                    })}
                  />
                  {errors.xp_value && (
                    <p className="text-error-600 text-sm mt-1">{errors.xp_value.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recommended Age</label>
                  <input
                    type="text"
                    placeholder="e.g. 8-10, 11-14"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    {...register("recommended_age", { required: "Recommended age is required" })}
                  />
                  {errors.recommended_age && (
                    <p className="text-error-600 text-sm mt-1">{errors.recommended_age.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setActiveTab('lessons')}
                  >
                    Next: Add Lessons
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
        
        {activeTab === 'lessons' && (
          <motion.div
            key="lessons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">Course Lessons</h2>
              
              {lessons.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No lessons added yet. Start by adding your first lesson!</p>
                  <button 
                    className="btn-primary"
                    onClick={addLesson}
                  >
                    Add First Lesson
                  </button>
                </div>
              ) : (
                <>
                  <DraggableLessonList 
                    lessons={lessons}
                    updateLesson={updateLesson}
                    removeLesson={removeLesson}
                    onReorder={handleReorder}
                  />
                  
                  <div className="mt-4">
                    <button 
                      className="btn-outline"
                      onClick={addLesson}
                    >
                      + Add Another Lesson
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setActiveTab('details')}
              >
                Back to Details
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit(onSubmitDetails)}
              >
                Create Course
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddCourse;