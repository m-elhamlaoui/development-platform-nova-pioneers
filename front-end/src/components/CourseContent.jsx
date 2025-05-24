import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Sparkles, Award, Star } from "lucide-react";

// Main Course Content Component
export default function CourseContent({ course }) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const currentLesson = course?.lessons?.[currentLessonIndex] || {};
  
  // Calculate overall progress percentage
  const progressPercentage = course?.lessons?.length 
    ? Math.round((completedLessons.length / course.lessons.length) * 100) 
    : 0;
  
  const handleLessonComplete = () => {
    if (!completedLessons.includes(currentLessonIndex)) {
      const newCompleted = [...completedLessons, currentLessonIndex];
      setCompletedLessons(newCompleted);
      
      // Show celebration if this was the last lesson
      if (newCompleted.length === course?.lessons?.length) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
    }
  };
  
  const goToNextLesson = () => {
    if (currentLessonIndex < (course?.lessons?.length - 1)) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };
  
  const goToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };
  
  // Save progress to localStorage
  useEffect(() => {
    if (course?.id) {
      localStorage.setItem(`course-progress-${course.id}`, JSON.stringify(completedLessons));
    }
  }, [completedLessons, course?.id]);
  
  // Load progress from localStorage
  useEffect(() => {
    if (course?.id) {
      const savedProgress = localStorage.getItem(`course-progress-${course.id}`);
      if (savedProgress) {
        setCompletedLessons(JSON.parse(savedProgress));
      }
    }
  }, [course?.id]);
  
  if (!course) return <div className="p-8 text-center">Course not found</div>;
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
      {/* Course Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <button 
            onClick={() => window.history.back()} 
            className="text-white/80 hover:text-white flex items-center gap-1 mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Courses
          </button>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-white/90">{course.description}</p>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Your progress</span>
              <span>{progressPercentage}% Complete</span>
            </div>
            <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-green-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
        
        {/* Instructor info */}
        <div className="flex items-center gap-3 px-6 py-3 bg-white border-b">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {course.instructor?.charAt(0) || "T"}
          </div>
          <div>
            <p className="font-medium">{course.instructor}</p>
            <p className="text-xs text-gray-500">Course Instructor</p>
          </div>
        </div>
      </div>
      
      {/* Lesson Navigation Tabs */}
      <div className="flex overflow-x-auto p-2 bg-gray-50 border-b">
        {course.lessons?.map((lesson, index) => (
          <button
            key={index}
            onClick={() => setCurrentLessonIndex(index)}
            className={`px-4 py-2 whitespace-nowrap rounded-lg mr-2 flex items-center gap-2 transition-all ${
              currentLessonIndex === index 
                ? "bg-blue-100 text-blue-700 font-medium" 
                : "hover:bg-gray-100"
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              completedLessons.includes(index) 
                ? "bg-green-500 text-white" 
                : "bg-gray-200 text-gray-600"
            }`}>
              {completedLessons.includes(index) ? <Check className="w-4 h-4" /> : (index + 1)}
            </div>
            <span className="text-sm">{lesson.title}</span>
          </button>
        ))}
      </div>
      
      {/* Current Lesson Content */}
      <div className="p-6">
        <motion.div
          key={currentLessonIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">{currentLesson.title}</h2>
          
          {/* Lesson Image */}
          {currentLesson.image && (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={currentLesson.image} 
                alt={currentLesson.title} 
                className="w-full object-cover h-64"
              />
            </div>
          )}
          
          {/* Lesson Content Sections */}
          <div className="prose max-w-none text-gray-700">
            {currentLesson.content?.map((section, idx) => (
              <div key={idx} className="mb-6">
                {section.subheading && (
                  <h3 className="text-xl font-medium text-gray-800 mb-2">{section.subheading}</h3>
                )}
                {section.text && (
                  <p className="mb-4">{section.text}</p>
                )}
                {section.image && (
                  <div className="my-4 rounded-lg overflow-hidden border border-gray-100">
                    <img 
                      src={section.image} 
                      alt={section.subheading || "Lesson illustration"} 
                      className="w-full h-auto"
                    />
                  </div>
                )}
                {section.funFact && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg my-4">
                    <div className="flex items-start">
                      <Sparkles className="w-5 h-5 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800 mb-1">Fun Fact!</p>
                        <p className="text-gray-700">{section.funFact}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Interactive Elements */}
          {currentLesson.quiz && (
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6">
              <h3 className="text-lg font-medium text-blue-800 mb-3">Quick Quiz</h3>
              <p className="mb-4">{currentLesson.quiz.question}</p>
              <div className="space-y-2">
                {currentLesson.quiz.options.map((option, idx) => (
                  <button 
                    key={idx}
                    className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    onClick={() => {
                      if (idx === currentLesson.quiz.correctIndex) {
                        alert("Correct! Great job!");
                      } else {
                        alert("Try again!");
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Navigation and Complete Button */}
      <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
        <button
          onClick={goToPrevLesson}
          disabled={currentLessonIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            currentLessonIndex === 0 
              ? "text-gray-400 cursor-not-allowed" 
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        
        <button
          onClick={handleLessonComplete}
          className={`px-5 py-2 rounded-lg font-medium ${
            completedLessons.includes(currentLessonIndex)
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {completedLessons.includes(currentLessonIndex) ? (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Completed
            </span>
          ) : "Mark as Complete"}
        </button>
        
        <button
          onClick={goToNextLesson}
          disabled={currentLessonIndex === course.lessons.length - 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            currentLessonIndex === course.lessons.length - 1
              ? "text-gray-400 cursor-not-allowed" 
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Course Completion Celebration Modal */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <div className="bg-white rounded-xl p-8 text-center max-w-md">
            <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <Award className="w-12 h-12 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
            <p className="text-gray-700 mb-6">You've completed the entire course! Great job!</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <button 
              onClick={() => setShowCelebration(false)}
              className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue Learning
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}