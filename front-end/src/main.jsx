import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import LandingPage from "./pages/LandingPage";
import NoPage from "./pages/NoPage";
import Signupteacher from "./pages/Signupteacher";
import ParentsDashboard from "./pages/ParentsDashboard";
import ParentsDashboardLessons from "./components/ParentsDashboardLessons";
import ParentsDashboardKids from "./components/ParentsDashboardKids";
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/TeachersDashboard';
import AddCourse from './pages/AddCourse';
import ManageCourses from './pages/ManageCourses';
import NotFound from './pages/NotFound';
import CourseView from './pages/CourseView';
export default function App() {
  return (
    <BrowserRouter>
    <DataProvider>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          {/* <Route path="*" element={<NoPage />} /> */}
          <Route path="/Signupteacher" element={<Signupteacher />}/>
          <Route path="/parents-dashboard" element={<ParentsDashboard />}/>
          <Route path="/parents-dashboard/lessons" element={<ParentsDashboardLessons />}/>
          <Route path="/parents-dashboard/kids" element={<ParentsDashboardKids />}/>
          <Route path="/course" element={<CourseView />} />
          <Route path="/course/:courseId" element={<CourseView />} />
            
          <Route path="/teachers" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="manage-courses" element={<ManageCourses />} />
            <Route path="*" element={<NotFound />} />
          </Route>

      </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);