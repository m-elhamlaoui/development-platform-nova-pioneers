import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronRight, List, Loader2, PlayCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import KidSidebar from '../components/KidSidebar';

const CourseLearning = ({ baseUrl = "http://localhost:9093" }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Get kid ID from storage
  const getKidId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      return user.id || null;
    } catch (err) {
      console.error('Error parsing user data:', err);
      return null;
    }
  };

  const kidId = getKidId();
  
  // Get current lesson
  const currentLesson = lessons[currentLessonIndex] || null;
  
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!kidId || !courseId) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        // Fetch course data
        const courseResponse = await fetch(`${baseUrl}/courses/${courseId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!courseResponse.ok) {
          throw new Error(`Failed to fetch course: ${courseResponse.status}`);
        }
        
        const courseData = await courseResponse.json();
        setCourse(courseData);
        
        // Use the lessons from the course data if available
        let lessonsData = courseData.lessons || [];
        
        // If no lessons available, create sample lessons
        if (!lessonsData || !Array.isArray(lessonsData) || lessonsData.length === 0) {
          lessonsData = [
            {
              id: "1",
              title: "Introduction to the Course",
              content: "Welcome to the first lesson! In this course, you'll learn the fundamentals of this subject.",
              completed: false
            },
            {
              id: "2",
              title: "Core Concepts",
              content: "This lesson covers the most important concepts that form the foundation of this subject.",
              completed: false
            },
            {
              id: "3",
              title: "Advanced Techniques",
              content: "Now that you understand the basics, let's explore some advanced techniques and applications.",
              completed: false
            }
          ];
        }
        
        setLessons(lessonsData);
        
        // Fetch current progress from enrollments
        const enrollmentsResponse = await fetch(`${baseUrl}/kids/${kidId}/enrollments`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (enrollmentsResponse.ok) {
          const enrollments = await enrollmentsResponse.json();
          const enrollment = enrollments.find(e => e.course_id === courseId || e.course_id === Number(courseId));
          
          if (enrollment) {
            const progressValue = enrollment.progress_percentage || 0;
            setProgress(progressValue);
            
            // If progress exists, mark appropriate lessons as completed
            if (progressValue > 0) {
              const completedLessonsCount = Math.floor((progressValue / 100) * lessonsData.length);
              const updatedLessons = lessonsData.map((lesson, index) => ({
                ...lesson,
                completed: index < completedLessonsCount
              }));
              
              setLessons(updatedLessons);
              
              // Set current lesson index to first incomplete lesson or last lesson
              const firstIncompleteIndex = updatedLessons.findIndex(lesson => !lesson.completed);
              if (firstIncompleteIndex !== -1) {
                setCurrentLessonIndex(firstIncompleteIndex);
              } else if (progressValue === 100) {
                setCurrentLessonIndex(updatedLessons.length - 1);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        toast.error(`Failed to load course: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [kidId, courseId, baseUrl, navigate]);
  
  // Complete current lesson and move to next
  const completeCurrentLesson = async () => {
    if (currentLessonIndex >= lessons.length - 1) {
      await updateProgress(100);
      toast.success("🎉 Congratulations! You've completed the course!");
      navigate('/kid/dashboard');
      return;
    }
    
    // Mark current lesson as completed
    const updatedLessons = [...lessons];
    updatedLessons[currentLessonIndex].completed = true;
    setLessons(updatedLessons);
    
    // Calculate new progress percentage
    const newProgress = Math.round(((currentLessonIndex + 1) / lessons.length) * 100);
    await updateProgress(newProgress);
    
    // Move to next lesson
    setCurrentLessonIndex(currentLessonIndex + 1);
  };
  
  const updateProgress = async (progressValue) => {
    setSaving(true);
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      // Find the enrollment ID for this course
      const enrollmentsResponse = await fetch(`${baseUrl}/kids/${kidId}/enrollments`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!enrollmentsResponse.ok) {
        throw new Error(`Failed to fetch enrollments: ${enrollmentsResponse.status}`);
      }
      
      const enrollments = await enrollmentsResponse.json();
      const enrollment = enrollments.find(e => e.course_id === courseId || e.course_id === Number(courseId));
      
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      const response = await fetch(`${baseUrl}/kids/${kidId}/enrollments/${enrollment.enrollment_id}/progress`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          progress_percentage: progressValue
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update progress: ${response.status}`);
      }
      
      setProgress(progressValue);
      
      // If course is completed, call the completion endpoint
      if (progressValue === 100) {
        console.log("Course completed, marking as complete...", kidId, enrollment.enrollment_id);
        try {
          const completeResponse = await fetch(`${baseUrl}/kids/${kidId}/enrollments/${enrollment.enrollment_id}/complete`, {
            method: 'PATCH',
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (!completeResponse.ok) {
            console.error('Failed to mark course as complete:', completeResponse.status);
          } else {
            const completionData = await completeResponse.json();
            // Show completion message with XP earned
            if (completionData.xp_earned) {
              toast.success(`🎉 Course completed! Earned ${completionData.xp_earned} XP!`);
            } else if (course && course.xp_value) {
              toast.success(`🎉 Course completed! Earned ${course.xp_value} XP!`);
            } else {
              toast.success(`🎉 Course completed!`);
            }
          }
        } catch (completeErr) {
          console.error("Error marking course as complete:", completeErr);
          // Still show success message even if completion endpoint fails
          toast.success(`🎉 Course completed!`);
        }
      }
    } catch (err) {
      console.error("Error updating progress:", err);
      toast.error(`Failed to save progress: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <KidSidebar baseUrl={baseUrl} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your course...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <KidSidebar baseUrl={baseUrl} />
      <div className="flex-1 flex">
        {showSidebar && (
          <div className="w-80 bg-white border-r border-gray-200 overflow-auto">
            <div className="p-4 border-b border-gray-200">
              <button 
                onClick={() => navigate('/kid/dashboard')}
                className="text-sm text-blue-600 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </button>
              <h2 className="font-bold text-xl mt-3">{course?.title}</h2>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{width: `${progress}%`}}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{progress}% Complete</p>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-sm text-gray-500 mb-3">COURSE CONTENT</h3>
              <ul className="space-y-2">
                {lessons.map((lesson, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setCurrentLessonIndex(index)}
                      className={`flex items-center justify-between w-full rounded-lg p-3 text-left ${
                        currentLessonIndex === index 
                          ? 'bg-blue-50 text-blue-700' 
                          : lesson.completed 
                            ? 'text-gray-700 bg-gray-50' 
                            : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          lesson.completed 
                            ? 'bg-green-100 text-green-600' 
                            : currentLessonIndex === index 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-500'
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle size={14} />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className="text-sm">{lesson.title}</span>
                      </div>
                      {currentLessonIndex === index && (
                        <PlayCircle size={16} className="text-blue-600" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <button
                onClick={() => navigate('/kid/dashboard')}
                className="text-sm text-blue-600 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="bg-white border border-gray-200 p-2 rounded-lg"
              >
                <List size={18} />
              </button>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="hidden lg:flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{currentLesson?.title}</h1>
                  <p className="text-gray-500 mt-1">
                    Lesson {currentLessonIndex + 1} of {lessons.length}
                  </p>
                </div>
                
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="text-sm text-gray-600 flex items-center"
                >
                  {showSidebar ? (
                    <>
                      <XCircle className="w-4 h-4 mr-1" />
                      Hide Lessons
                    </>
                  ) : (
                    <>
                      <List className="w-4 h-4 mr-1" />
                      Show Lessons
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4 lg:hidden">{currentLesson?.title}</h2>
                
                <div className="prose max-w-none">
                  <p>{currentLesson?.content || "No content available for this lesson."}</p>
                  
                  <h3>Key Concepts</h3>
                  <ul>
                    <li>Understanding the fundamental principles of this topic</li>
                    <li>Exploring practical applications and examples</li>
                    <li>Connecting these ideas to everyday experience</li>
                  </ul>
                  
                  <h3>Learning Activities</h3>
                  <p>
                    Try these interactive exercises to test your understanding of the concepts covered in this lesson.
                    These activities will help reinforce what you've learned and prepare you for the next lesson.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg my-6">
                    <h4 className="font-bold">Self-Check Questions</h4>
                    <p>Make sure you understand these key points before moving on:</p>
                    <ul>
                      <li>Can you explain the main concepts in your own words?</li>
                      <li>Could you teach this material to someone else?</li>
                      <li>How does this topic connect to what you already know?</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        if (currentLessonIndex > 0) {
                          setCurrentLessonIndex(currentLessonIndex - 1);
                        }
                      }}
                      disabled={currentLessonIndex === 0}
                      className={`px-4 py-2 rounded ${
                        currentLessonIndex === 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      Previous Lesson
                    </button>
                    
                    <button
                      onClick={completeCurrentLesson}
                      disabled={saving}
                      className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : currentLessonIndex === lessons.length - 1 ? (
                        <>
                          Complete Course
                          <CheckCircle size={16} className="ml-2" />
                        </>
                      ) : (
                        <>
                          Complete & Continue
                          <ChevronRight size={16} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;