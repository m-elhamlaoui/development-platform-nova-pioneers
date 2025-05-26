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
import KidDashboard from './pages/KidDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminHome from './components/AdminHome';
import ManageUsers from './components/ManageUsers';
import ConfirmTeachers from './components/ConfirmTeachers';
import ManageAlerts from './components/ManageAlerts';
import KidSettings from './pages/KidSettings';
import CourseLearning from './pages/CourseLearning';
export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          {/* <Route path="*" element={<NoPage />} /> */}
          <Route path="/Signupteacher" element={<Signupteacher />} />
          <Route path="/parents-dashboard" element={<ParentsDashboard />} />
          <Route path="/parents-dashboard/lessons" element={<ParentsDashboardLessons />} />
          <Route path="/parents-dashboard/kids" element={<ParentsDashboardKids />} />
          <Route path="/course" element={<CourseView />} />
          <Route path="/course/:courseId/view" element={<CourseView />} />

          <Route path="/teachers" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="manage-courses" element={<ManageCourses />} />
          </Route>

          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="" element={<AdminHome />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="confirm-teachers" element={<ConfirmTeachers />} />
            <Route path="manage-alerts" element={<ManageAlerts />} />
          </Route>

          <Route path="/kid/dashboard" element={<KidDashboard baseUrl="http://localhost:9093" />} />
          <Route path="/course/:courseId/view" element={<CourseView baseUrl="http://localhost:9093" />} />
          <Route path="/course/:courseId/learn" element={<CourseLearning baseUrl="http://localhost:9093" />} />
          <Route path="/kid/settings" element={<KidSettings baseUrl="http://localhost:9093" />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);