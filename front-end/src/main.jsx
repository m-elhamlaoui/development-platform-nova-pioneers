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
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="*" element={<NoPage />} />
          <Route path="/Signupteacher" element={<Signupteacher />}/>
          <Route path="/parents-dashboard" element={<ParentsDashboard />}/>
          <Route path="/parents-dashboard/lessons" element={<ParentsDashboardLessons />}/>
          <Route path="/parents-dashboard/kids" element={<ParentsDashboardKids />}/>
      
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);