import { useState } from "react";
import { Trash2, Plus, Upload, Save, Check, Eye, EyeOff, PlusCircle } from "lucide-react";

export default function CourseCreator() {
  const [course, setCourse] = useState({
    id: `course-${Date.now()}`,
    title: "",
    description: "",
    thumbnail: "/api/placeholder/800/600",
    instructor: "",
    rating: 5,
    reviews: 0,
    lessons: [
      {
        title: "Introduction",
        image: "/api/placeholder/800/450",
        content: [
          {
            subheading: "Welcome to the course!",
            text: "Let's learn something amazing together!",
          }
        ]
      }
    ]
  });
  
  const [activeTab, setActiveTab] = useState("basics");
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Helper function to update course
  const updateCourse = (updates) => {
    setCourse(prev => ({ ...prev, ...updates }));
  };
  
  // Helper function to update current lesson
  const updateCurrentLesson = (updates) => {
    setCourse(prev => {
      const newLessons = [...prev.lessons];
      newLessons[currentLessonIndex] = {
        ...newLessons[currentLessonIndex],
        ...updates
      };
      return { ...prev, lessons: newLessons };
    });
  };
  
  // Helper function to update current section
  const updateCurrentSection = (updates) => {
    setCourse(prev => {
      const newLessons = [...prev.lessons];
      const newContent = [...(newLessons[currentLessonIndex].content || [])];
      newContent[currentSectionIndex] = {
        ...newContent[currentSectionIndex],
        ...updates
      };
      newLessons[currentLessonIndex] = {
        ...newLessons[currentLessonIndex],
        content: newContent
      };
      return { ...prev, lessons: newLessons };
    });
  };
  
  // Add a new lesson
  const addLesson = () => {
    setCourse(prev => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          title: `Lesson ${prev.lessons.length + 1}`,
          image: "/api/placeholder/800/450",
          content: [{ subheading: "New Section", text: "" }]
        }
      ]
    }));
    setCurrentLessonIndex(course.lessons.length);
    setCurrentSectionIndex(0);
  };
  
  // Remove a lesson
  const removeLesson = (index) => {
    if (course.lessons.length <= 1) {
      alert("You need at least one lesson!");
      return;
    }
    
    setCourse(prev => {
      const newLessons = prev.lessons.filter((_, i) => i !== index);
      return { ...prev, lessons: newLessons };
    });
    
    if (currentLessonIndex >= index && currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };
  
  // Add a section to current lesson
  const addSection = () => {
    setCourse(prev => {
      const newLessons = [...prev.lessons];
      const newContent = [
        ...(newLessons[currentLessonIndex].content || []),
        { subheading: "", text: "" }
      ];
      newLessons[currentLessonIndex] = {
        ...newLessons[currentLessonIndex],
        content: newContent
      };
      return { ...prev, lessons: newLessons };
    });
    setCurrentSectionIndex(course.lessons[currentLessonIndex].content?.length || 0);
  };
  
  // Remove a section
  const removeSection = (index) => {
    if (!course.lessons[currentLessonIndex].content || 
        course.lessons[currentLessonIndex].content.length <= 1) {
      alert("You need at least one content section!");
      return;
    }
    
    setCourse(prev => {
      const newLessons = [...prev.lessons];
      const newContent = newLessons[currentLessonIndex].content.filter((_, i) => i !== index);
      newLessons[currentLessonIndex] = {
        ...newLessons[currentLessonIndex],
        content: newContent
      };
      return { ...prev, lessons: newLessons };
    });
    
    if (currentSectionIndex >= index && currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };
  
  // Add a quiz to the current lesson
  const addQuiz = () => {
    updateCurrentLesson({
      quiz: {
        question: "What did you learn in this lesson?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: 0
      }
    });
  };
  
  // Save course to localStorage
  const saveCourse = () => {
    try {
      // Get existing courses
      const existingCourses = JSON.parse(localStorage.getItem("child-courses") || "[]");
      
      // Check if course already exists
      const courseIndex = existingCourses.findIndex(c => c.id === course.id);
      
      if (courseIndex >= 0) {
        // Update existing course
        existingCourses[courseIndex] = course;
      } else {
        // Add new course
        existingCourses.push(course);
      }
      
      // Save back to localStorage
      localStorage.setItem("child-courses", JSON.stringify(existingCourses));
      
      alert("Course saved successfully!");
    } catch (error) {
      alert("Failed to save course: " + error.message);
    }
  };
  
  // Helper function to add fun fact to current section
  const addFunFact = () => {
    updateCurrentSection({
      funFact: "Add your fun fact here!"
    });
  };
  
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Course Creator</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
          >
            {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {previewMode ? "Edit Mode" : "Preview"}
          </button>
          <button 
            onClick={saveCourse}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Save className="w-4 h-4" /> Save Course
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("basics")}
            className={`px-6 py-3 ${activeTab === "basics" ? "border-b-2 border-blue-500 text-blue-600 font-medium" : "text-gray-500"}`}
          >
            Course Basics
          </button>
          <button
            onClick={() => setActiveTab("lessons")}
            className={`px-6 py-3 ${activeTab === "lessons" ? "border-b-2 border-blue-500 text-blue-600 font-medium" : "text-gray-500"}`}
          >
            Lessons
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {activeTab === "basics" && (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
              <input
                type="text"
                value={course.title}
                onChange={(e) => updateCourse({ title: e.target.value })}
                placeholder="Enter an engaging title for your course"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
              <textarea
                value={course.description}
                onChange={(e) => updateCourse({ description: e.target.value })}
                placeholder="Describe what children will learn in this course"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Name</label>
              <input
                type="text"
                value={course.instructor}
                onChange={(e) => updateCourse({ instructor: e.target.value })}
                placeholder="Enter instructor name"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail Image
              </label>
              <div className="flex items-center gap-4">
                <img 
                  src={course.thumbnail} 
                  alt="Course thumbnail" 
                  className="w-40 h-24 object-cover rounded-lg border"
                />
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  <Upload className="w-4 h-4" /> Upload Image
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use a bright, engaging image that represents your course content
              </p>
            </div>
          </div>
        )}
        
        {activeTab === "lessons" && (
          <div className="grid grid-cols-3 gap-6">
            {/* Lesson List */}
            <div className="col-span-1 border-r pr-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium">Lessons</h2>
                <button 
                  onClick={addLesson}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg flex justify-between items-center cursor-pointer ${
                      currentLessonIndex === index ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setCurrentLessonIndex(index);
                      setCurrentSectionIndex(0);
                    }}
                  >
                    <span className="font-medium">{lesson.title || `Lesson ${index + 1}`}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLesson(index);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Lesson Content Editor */}
            <div className="col-span-2">
              <h2 className="font-medium mb-4">Lesson Details</h2>
              
              {course.lessons[currentLessonIndex] && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                    <input
                      type="text"
                      value={course.lessons[currentLessonIndex].title}
                      onChange={(e) => updateCurrentLesson({ title: e.target.value })}
                      placeholder="Enter lesson title"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Image
                    </label>
                    <div className="flex items-center gap-4">
                      <img 
                        src={course.lessons[currentLessonIndex].image} 
                        alt="Lesson thumbnail" 
                        className="w-40 h-24 object-cover rounded-lg border"
                      />
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        <Upload className="w-4 h-4" /> Upload Image
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Content Sections</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={addSection}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                        >
                          <Plus className="w-3 h-3" /> Add Section
                        </button>
                        <button 
                          onClick={addFunFact}
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 text-sm"
                        >
                          <PlusCircle className="w-3 h-3" /> Add Fun Fact
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                      {course.lessons[currentLessonIndex].content?.map((section, index) => (
                        <div 
                          key={index} 
                          className={`p-4 border rounded-lg bg-white ${
                            currentSectionIndex === index ? "ring-2 ring-blue-300" : ""
                          }`}
                          onClick={() => setCurrentSectionIndex(index)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-500">Section {index + 1}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSection(index);
                              }}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <input
                                type="text"
                                value={section.subheading || ""}
                                onChange={(e) => {
                                  setCurrentSectionIndex(index);
                                  updateCurrentSection({ subheading: e.target.value });
                                }}
                                placeholder="Section Heading"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            
                            <div>
                              <textarea
                                value={section.text || ""}
                                onChange={(e) => {
                                  setCurrentSectionIndex(index);
                                  updateCurrentSection({ text: e.target.value });
                                }}
                                placeholder="Section content"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                              />
                            </div>
                            
                            {section.funFact && (
                              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                <label className="block text-sm font-medium text-yellow-700 mb-1">Fun Fact</label>
                                <textarea
                                  value={section.funFact}
                                  onChange={(e) => {
                                    setCurrentSectionIndex(index);
                                    updateCurrentSection({ funFact: e.target.value });
                                  }}
                                  placeholder="Add a fun fact related to this topic"
                                  className="w-full p-2 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 h-16 bg-white"
                                />
                              </div>
                            )}
                            
                            {section.image && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Section Image
                                </label>
                                <div className="flex items-center gap-4">
                                  <img 
                                    src={section.image} 
                                    alt="Section illustration" 
                                    className="w-20 h-20 object-cover rounded-lg border"
                                  />
                                  <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm">
                                    <Upload className="w-3 h-3" /> Change
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between border-t pt-4">
                    <button 
                      onClick={addQuiz}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        course.lessons[currentLessonIndex].quiz 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      disabled={!!course.lessons[currentLessonIndex].quiz}
                    >
                      <Plus className="w-4 h-4" /> 
                      {course.lessons[currentLessonIndex].quiz ? "Quiz Added" : "Add Quiz"}
                    </button>
                    
                    <button 
                      onClick={saveCourse}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                  
                  {course.lessons[currentLessonIndex].quiz && (
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <h3 className="font-medium text-blue-800 mb-3">Quiz Editor</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                          <input
                            type="text"
                            value={course.lessons[currentLessonIndex].quiz.question}
                            onChange={(e) => updateCurrentLesson({ 
                              quiz: {
                                ...course.lessons[currentLessonIndex].quiz,
                                question: e.target.value
                              } 
                            })}
                            placeholder="Enter quiz question"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                          {course.lessons[currentLessonIndex].quiz.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <input
                                type="radio"
                                checked={course.lessons[currentLessonIndex].quiz.correctIndex === index}
                                onChange={() => updateCurrentLesson({ 
                                  quiz: {
                                    ...course.lessons[currentLessonIndex].quiz,
                                    correctIndex: index
                                  } 
                                })}
                                className="w-4 h-4 text-blue-600"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...course.lessons[currentLessonIndex].quiz.options];
                                  newOptions[index] = e.target.value;
                                  updateCurrentLesson({ 
                                    quiz: {
                                      ...course.lessons[currentLessonIndex].quiz,
                                      options: newOptions
                                    } 
                                  });
                                }}
                                placeholder={`Option ${index + 1}`}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          ))}
                          <p className="text-xs text-blue-600 font-medium mt-1">
                            Select the radio button next to the correct answer
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}