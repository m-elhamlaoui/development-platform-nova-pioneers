import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Award, BarChart2, Calendar } from 'lucide-react';
import Menu from '../components/ui/Menu';
import { toast } from 'react-toastify';

export default function CourseView() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        const response = await fetch(`http://localhost:9093/courses/${courseId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch course: ${response.status}`);
        }
        
        const courseData = await response.json();
        setCourse(courseData);
        
      } catch (err) {
        console.error("Error fetching course details:", err);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Menu />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen">
        <Menu />
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-red-600 mb-4">Course not found</p>
          <button 
            onClick={() => navigate('/parents-dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Menu />
      
      <div className="flex-grow px-6 py-8 overflow-y-auto">
        <button 
          onClick={() => navigate('/parents-dashboard')}
          className="flex items-center gap-2 text-blue-600 mb-6 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        
        {/* Hero section */}
        <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden mb-8">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                {course.subject}
              </span>
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs">
                {course.grade_level}
              </span>
              <div className="flex items-center text-amber-400 ml-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-lg">
                      {i < Math.round(course.rating || 0) ? "★" : "☆"}
                    </span>
                  ))}
                <span className="ml-1 text-white text-sm">({course.reviews || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">About this course</h2>
              <p className="text-gray-700 mb-6">{course.description}</p>
              
              <h3 className="text-lg font-semibold mb-3">What you'll learn</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                {course.learning_objectives ? 
                  course.learning_objectives.map((objective, index) => (
                    <li key={index} className="text-gray-700">{objective}</li>
                  )) : 
                  <li className="text-gray-500">Learning objectives not specified</li>
                }
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">Course Content</h3>
              <div className="space-y-3">
                {course.lessons && course.lessons.length > 0 ? 
                  course.lessons.map((lesson, index) => (
                    <div key={index} className="border border-gray-200 rounded p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{index + 1}. {lesson.title}</h4>
                        <span className="text-sm text-gray-500">{lesson.duration} min</span>
                      </div>
                      {lesson.description && (
                        <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                      )}
                    </div>
                  )) : 
                  <p className="text-gray-500">No lessons available yet</p>
                }
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-xl p-6 mb-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Course Information</h2>
              
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BookOpen className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium">{course.subject}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Clock className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{course.duration || "Self-paced"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Award className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">XP Value</p>
                    <p className="font-medium">{course.xp_value || 0} XP</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <BarChart2 className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-medium">{course.difficulty || "Beginner"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-100 rounded-full">
                    <Calendar className="text-pink-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">
                      {course.created_date ? new Date(course.created_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-center font-medium text-gray-700 mb-2">
                  Go back to dashboard to enroll your child
                </p>
                <button 
                  onClick={() => navigate('/parents-dashboard')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}