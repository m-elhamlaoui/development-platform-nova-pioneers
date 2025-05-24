import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Award, 
  Users, 
  User, 
  Clock, 
  CheckCircle, 
  PlayCircle,
  Download,
  ExternalLink,
  ChevronDown,
  FileText,
  Lightbulb
} from 'lucide-react';
import { useData } from '../context/DataContext';

// Default sample course for testing when no ID is provided
const defaultCourse = {
  id: "default-course",
  title: "Introduction to Space Science",
  description: "Explore the wonders of our universe in this comprehensive introduction to space science. Learn about planets, stars, galaxies, and the fundamental laws that govern them all. Perfect for beginners with a curiosity about space.",
  thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
  grade_level: "Grade 5-8",
  subject: "Science",
  instructor: "Dr. Stella Nova",
  created_date: "2025-04-10T10:30:00Z",
  xp_value: 150,
  size_category: "Medium",
  recommended_age: "10-13",
  rating: 4.5,
  reviews: 24,
  lessons: [
    {
      id: "lesson-1",
      title: "Our Solar System",
      content: "The solar system consists of the Sun and everything that orbits around it, including planets, dwarf planets, moons, asteroids, comets, and meteoroids. The Sun, a star, is at the center, and eight planets orbit around it: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
      sequence_order: 1,
      fun_fact: "If you could drive your car straight up into the sky, it would take less than a day to reach outer space, but more than 100 years to reach the Sun!",
      lesson_contents: [
        {
          type: "text",
          title: "Introduction to the Solar System",
          description: "What makes up our cosmic neighborhood",
          text: "Our solar system formed about 4.6 billion years ago from a dense cloud of interstellar gas and dust. The cloud collapsed, possibly due to the shockwave of a nearby exploding star, called a supernova. When this dust cloud collapsed, it formed a solar nebula—a spinning, swirling disk of material.",
          fun_fact: "The Sun makes up 99.86% of the mass of the entire solar system!"
        },
        {
          type: "image",
          title: "Solar System Diagram",
          description: "Visual representation of planets and their orbits",
          url: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
          fun_fact: "Jupiter is so large that all the other planets in our solar system could fit inside it!"
        },
        {
          type: "video",
          title: "Planetary Motion Explained",
          description: "Learn how planets move around the Sun",
          fun_fact: "Venus rotates so slowly that a day on Venus is longer than a year on Venus!"
        }
      ],
      resource_links: [
        {
          title: "NASA Solar System Exploration",
          url: "https://solarsystem.nasa.gov/",
          type: "link"
        },
        {
          title: "Planetary Fact Sheet",
          url: "#",
          type: "pdf"
        }
      ]
    },
    {
      id: "lesson-2",
      title: "Stars and Galaxies",
      content: "Stars are massive celestial bodies composed primarily of hydrogen and helium that produce light and heat from the churning nuclear forges inside their cores. Galaxies are vast systems of stars, stellar remnants, interstellar gas, dust, and dark matter bound together by gravity.",
      sequence_order: 2,
      fun_fact: "There are more stars in the universe than grains of sand on all the beaches on Earth!",
      lesson_contents: [
        {
          type: "text",
          title: "The Life Cycle of Stars",
          description: "From birth to death of stellar objects",
          text: "Stars begin their lives as vast clouds of cold molecular hydrogen that collapse under their own gravity. As the cloud collapses, it fragments into smaller pieces that form star systems. The central region of a collapsing fragment becomes hotter and denser, forming a protostar surrounded by a disk of gas and dust.",
          fun_fact: "Neutron stars are so dense that a teaspoon would weigh about 4 billion tons!"
        },
        {
          type: "image",
          title: "Galaxy Types",
          description: "Different classifications of galaxies",
          url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
          fun_fact: "Our Milky Way galaxy is spiraling through space at 552,000 mph!"
        }
      ],
      resource_links: [
        {
          title: "Hubble Telescope Images",
          url: "https://hubblesite.org/",
          type: "link"
        }
      ]
    },
    {
      id: "lesson-3",
      title: "Space Exploration",
      content: "Space exploration is the ongoing discovery and exploration of celestial structures beyond Earth by means of continuously evolving and growing space technology. Physical exploration of space is conducted both by human spaceflights and by robotic spacecraft.",
      sequence_order: 3,
      fun_fact: "Astronauts can grow up to 2 inches (5 cm) taller in space due to the spine stretching in zero gravity!",
      lesson_contents: [
        {
          type: "text",
          title: "History of Space Missions",
          description: "Key milestones in human space exploration",
          text: "The space age began on October 4, 1957, when the Soviet Union launched Sputnik 1, the first artificial satellite. This was followed by the first human in space, Yuri Gagarin, on April 12, 1961. The United States responded with various Mercury, Gemini, and Apollo missions, culminating in the first Moon landing on July 20, 1969, with Apollo 11.",
          fun_fact: "The first animal in orbit was a dog named Laika, launched by the Soviet Union in 1957!"
        },
        {
          type: "video",
          title: "Modern Space Agencies",
          description: "Overview of NASA, ESA, ISRO, and other space agencies",
          fun_fact: "There are currently over 2,000 active satellites orbiting Earth!"
        }
      ],
      resource_links: [
        {
          title: "Timeline of Space Exploration",
          url: "#",
          type: "pdf"
        }
      ]
    }
  ]
};

// Fun fact component - styled attractively
const FunFact = ({ fact }) => (
  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-400 p-4 rounded-r-lg my-6">
    <div className="flex items-start">
      <div className="bg-indigo-100 p-2 rounded-full mr-3 flex-shrink-0">
        <Lightbulb size={20} className="text-indigo-600" />
      </div>
      <div>
        <h4 className="font-bold text-indigo-700 text-sm uppercase tracking-wide mb-1">Fun Fact</h4>
        <p className="text-indigo-900 italic">{fact}</p>
      </div>
    </div>
  </div>
);

// Lesson completion celebration
const CompletionCelebration = ({ isVisible, onClose, xpGained }) => {
  if (!isVisible) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-2xl p-8 max-w-md mx-4 relative text-center shadow-2xl"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div className="text-4xl">🎉</div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Lesson Completed!</h2>
        <p className="text-gray-600 mb-4">Great job! You've earned {xpGained} XP for completing this lesson.</p>
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold flex items-center">
            <Award size={20} className="mr-2" />
            +{xpGained} XP
          </div>
        </div>
        <button 
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
};

const CourseView = () => {
  const { courseId } = useParams();
  const { courses } = useData();
  const navigate = useNavigate();
  
  // Find course by ID or use default if not found
  let course = courses?.find(c => c.id === courseId);
  
  // Use default course if no course is found or courseId is undefined
  if (!course) {
    console.log("Using default course for preview");
    course = defaultCourse;
  }
  
  // State for lesson progress tracking
  const [progress, setProgress] = useState(() => {
    // Try to get from localStorage first
    const savedProgress = localStorage.getItem(`course-${course.id}-progress`);
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    // Default progress object - all lessons incomplete
    return course?.lessons?.reduce((acc, lesson) => {
      acc[lesson.id] = false;
      return acc;
    }, {}) || {};
  });
  
  // Total progress percentage
  const [progressPercent, setProgressPercent] = useState(0);
  
  // Active lesson state
  const [activeLessonId, setActiveLessonId] = useState(
    course?.lessons?.[0]?.id || null
  );
  
  // Current active lesson
  const activeLesson = course?.lessons?.find(
    lesson => lesson.id === activeLessonId
  );

  // Celebration modal state
  const [showCelebration, setShowCelebration] = useState(false);
  
  // When progress changes, save to localStorage and update percentage
  useEffect(() => {
    if (course?.lessons?.length) {
      // Save progress to localStorage
      localStorage.setItem(
        `course-${course.id}-progress`, 
        JSON.stringify(progress)
      );
      
      // Calculate percentage
      const completedCount = Object.values(progress).filter(Boolean).length;
      const totalLessons = course.lessons.length;
      const percentage = Math.round((completedCount / totalLessons) * 100);
      setProgressPercent(percentage);
    }
  }, [progress, course, courseId]);
  
  // Complete the lesson and show celebration
  const completeLesson = (lessonId) => {
    // Only show celebration if lesson wasn't already completed
    if (!progress[lessonId]) {
      setProgress(prev => ({
        ...prev,
        [lessonId]: true
      }));
      setShowCelebration(true);
    }
  };
  
  // Move to next lesson
  const goToNextLesson = () => {
    const currentIndex = course.lessons.findIndex(lesson => lesson.id === activeLessonId);
    if (currentIndex < course.lessons.length - 1) {
      setActiveLessonId(course.lessons[currentIndex + 1].id);
      // Scroll to top of lesson content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Close celebration and possibly move to next lesson
  const handleCloseCelebration = () => {
    setShowCelebration(false);
    // Auto-navigate to next lesson
    goToNextLesson();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-16"
    >
      {/* Celebration Modal */}
      <CompletionCelebration 
        isVisible={showCelebration} 
        onClose={handleCloseCelebration}
        xpGained={20} // Award 20 XP for each lesson
      />

      {/* Course Header with Background Image */}
      <div 
        className="relative h-64 md:h-80 lg:h-96 bg-cover bg-center flex items-end" 
        style={{ backgroundImage: `url(${course.thumbnail})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-full transition-all"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 mb-6">
          <div className="flex flex-wrap items-end">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-xs font-semibold text-white px-2 py-1 rounded">
                  {course.grade_level}
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-xs font-medium text-white px-2 py-1 rounded">
                  {course.subject}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {course.title}
              </h1>
              <div className="flex items-center text-white/80 gap-4 text-sm">
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>{new Date(course.created_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Users size={14} className="mr-1" />
                  <span>Ages {course.recommended_age}</span>
                </div>
                <div className="flex items-center">
                  <Award size={14} className="mr-1" />
                  <span>{course.xp_value} XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-8">
            {/* Course Description */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {course.description}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6">
                <div>
                  <div className="text-gray-500 text-sm">Subject</div>
                  <div className="font-medium">{course.subject}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Grade Level</div>
                  <div className="font-medium">{course.grade_level}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Size</div>
                  <div className="font-medium">{course.size_category}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Lessons</div>
                  <div className="font-medium">{course.lessons?.length || 0}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Age Range</div>
                  <div className="font-medium">{course.recommended_age || 'All ages'}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Instructor</div>
                  <div className="font-medium">{course.instructor}</div>
                </div>
              </div>
            </div>
            
            {/* Active Lesson View */}
            {activeLesson && (
              <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">{activeLesson.title}</h2>
                </div>
                
                <div className="prose prose-blue max-w-none">
                  <p>{activeLesson.content || 'No content available for this lesson.'}</p>
                  
                  {/* Lesson Fun Fact */}
                  {activeLesson.fun_fact && (
                    <FunFact fact={activeLesson.fun_fact} />
                  )}
                  
                  {/* Lesson Resources */}
                  {activeLesson.lesson_contents && activeLesson.lesson_contents.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4">Lesson Contents</h3>
                      <div className="space-y-6">
                        {activeLesson.lesson_contents.map((content, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-6">
                            <h4 className="font-medium text-lg mb-2">{content.title}</h4>
                            <p className="text-gray-700 mb-4">{content.description}</p>
                            
                            {content.type === 'video' && (
                              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                                <PlayCircle size={40} className="text-gray-400" />
                                <span className="ml-2 text-gray-400">Video Placeholder</span>
                              </div>
                            )}
                            {content.type === 'text' && (
                              <div className="prose prose-sm max-w-none mb-4">
                                <p>{content.text}</p>
                              </div>
                            )}
                            {content.type === 'image' && (
                              <div className="rounded-lg overflow-hidden mb-4">
                                <img 
                                  src={content.url} 
                                  alt={content.title}
                                  className="w-full h-auto" 
                                />
                              </div>
                            )}
                            
                            {/* Content-level Fun Fact */}
                            {content.fun_fact && (
                              <FunFact fact={content.fun_fact} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Resource Links */}
                  {activeLesson.resource_links && activeLesson.resource_links.length > 0 && (
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-xl font-semibold mb-4">Additional Resources</h3>
                      <div className="space-y-3">
                        {activeLesson.resource_links.map((resource, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center">
                              {resource.type === 'pdf' ? (
                                <div className="bg-red-100 text-red-700 p-2 rounded-lg mr-3">
                                  <Download size={16} />
                                </div>
                              ) : (
                                <div className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3">
                                  <ExternalLink size={16} />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{resource.title}</div>
                                <div className="text-xs text-gray-500">{resource.type.toUpperCase()}</div>
                              </div>
                            </div>
                            <a 
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              {resource.type === 'pdf' ? 'Download' : 'Visit'}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lesson Completion Button */}
                  <div className="mt-10 pt-6 border-t">
                    <button
                      onClick={() => completeLesson(activeLesson.id)}
                      disabled={progress[activeLesson.id]}
                      className={`w-full py-3 rounded-xl font-bold flex items-center justify-center ${
                        progress[activeLesson.id]
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      } transition-colors`}
                    >
                      {progress[activeLesson.id] ? (
                        <>
                          <CheckCircle size={20} className="mr-2" />
                          Lesson Completed
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} className="mr-2" />
                          Mark as Completed
                        </>
                      )}
                    </button>
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-4">
                      {course.lessons.findIndex(lesson => lesson.id === activeLessonId) > 0 && (
                        <button
                          onClick={() => {
                            const currentIndex = course.lessons.findIndex(lesson => lesson.id === activeLessonId);
                            if (currentIndex > 0) {
                              setActiveLessonId(course.lessons[currentIndex - 1].id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center"
                        >
                          <ArrowLeft size={16} className="mr-2" />
                          Previous Lesson
                        </button>
                      )}
                      
                      {course.lessons.findIndex(lesson => lesson.id === activeLessonId) < course.lessons.length - 1 && (
                        <button
                          onClick={goToNextLesson}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center ml-auto"
                        >
                          Next Lesson
                          <ArrowLeft size={16} className="ml-2 transform rotate-180" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar - Right Column */}
          <div className="lg:col-span-4">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Your Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{progressPercent}% Complete</span>
                  <span>{Object.values(progress).filter(Boolean).length}/{course.lessons?.length} Lessons</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-blue-600 rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex gap-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Completed</span>
                </div>
              </div>
              
              {progressPercent === 100 && (
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
                  <div className="flex items-center text-green-700 mb-1">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="font-medium">Course Completed!</span>
                  </div>
                  <p className="text-green-600 text-sm">
                    Congratulations on completing this course. You've earned {course.xp_value} XP.
                  </p>
                </div>
              )}
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center">
                {progressPercent < 100 ? (
                  <>
                    <PlayCircle size={16} className="mr-2" />
                    Continue Learning
                  </>
                ) : (
                  <>
                    <Award size={16} className="mr-2" />
                    View Certificate
                  </>
                )}
              </button>
            </div>
            
            {/* Lessons List */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Course Lessons</h3>
              <div className="space-y-3">
                {course.lessons?.map((lesson, idx) => (
                  <div 
                    key={lesson.id}
                    className={`border rounded-lg transition-all ${
                      activeLessonId === lesson.id 
                        ? 'border-blue-500 shadow-sm bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <button 
                      className="w-full text-left p-3 flex items-center justify-between"
                      onClick={() => setActiveLessonId(lesson.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-3 ${
                          progress[lesson.id] 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {progress[lesson.id] ? (
                            <CheckCircle size={14} />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>
                        <div>
                          <div className={`font-medium ${
                            activeLessonId === lesson.id ? 'text-blue-700' : 'text-gray-800'
                          }`}>
                            {lesson.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {lesson.lesson_contents?.length || 0} resources
                          </div>
                        </div>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`text-gray-400 transition-transform ${
                          activeLessonId === lesson.id ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {/* Lesson Content Preview */}
                    <AnimatePresence>
                      {activeLessonId === lesson.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 border-t border-gray-100 mt-2 pt-2">
                            {lesson.lesson_contents?.length > 0 ? (
                              <div className="space-y-2">
                                {lesson.lesson_contents.map((content, cidx) => (
                                  <div key={cidx} className="flex items-center text-sm">
                                    {content.type === 'video' && (
                                      <PlayCircle size={14} className="text-blue-500 mr-2" />
                                    )}
                                    {content.type === 'text' && (
                                      <FileText size={14} className="text-gray-500 mr-2" />
                                    )}
                                    {content.type === 'image' && (
                                      <BookOpen size={14} className="text-purple-500 mr-2" />
                                    )}
                                    <span className="text-gray-700 truncate">{content.title}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 italic">No additional content</div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseView;