import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CourseView from './pages/CourseView';
import KidDashboard from './pages/KidDashboard';
// ...other imports

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          {/* Landing and Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/Signupteacher" element={<Signupteacher/>} />
          
          {/* Layout with sidebar navigation */}
          <Route element={<Layout />}>
            {/* Student/Teacher routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course" element={<CourseView />} />
            <Route path="/course/:courseId" element={<CourseView />} />
            
            {/* Teacher routes */}
            <Route path="/teachers/dashboard" element={<TeachersDashboard />} />
            <Route path="/teachers/add-course" element={<AddCourse />} />
            <Route path="/teachers/manage-courses" element={<ManageCourses />} />
          </Route>
          
          {/* Kid Dashboard routes (no shared layout) */}
          <Route path="/kid/dashboard" element={<KidDashboard />} />
          <Route path="/kid/courses" element={<KidDashboard />} />
          <Route path="/kid/achievements" element={<KidDashboard />} />
          <Route path="/kid/badges" element={<KidDashboard />} />
          <Route path="/kid/certificates" element={<KidDashboard />} />
          <Route path="/kid/settings" element={<KidDashboard />} />
          
          {/* Fallback */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;