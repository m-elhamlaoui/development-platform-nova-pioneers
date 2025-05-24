import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import dashlogo from "../../assets/np-logo.png";

import {
  LayoutDashboard,
  Plus,
  BookOpen,
  Settings,
  LogOut,
  X,
  Award,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, openSettings }) => {
  const { teacher, getXpLevel } = useData();
  
  // Safe access to teacher data with default values
  const safeTeacher = teacher || {
    name: "Teacher Name",
    email: "teacher@example.com",
    xpPoints: 0,
    avatar: "https://via.placeholder.com/80x80?text=T"
  };
  
  const xpStatus = getXpLevel ? getXpLevel(safeTeacher.xpPoints || 0) : { 
    level: "Beginner", 
    color: "bg-gray-400" 
  };
  
  const [showSettings, setShowSettings] = useState(false);
  const [profile, setProfile] = useState({ 
    name: safeTeacher.name, 
    email: safeTeacher.email 
  });

  const toggleSettings = () => setShowSettings(!showSettings);
  
  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSettings(false);
    console.log("Updated Profile:", profile);
  };

  // Show loading state if teacher data is not available
  if (!teacher) {
    return (
      <>
        {/* Mobile burger menu */}
        <div className="fixed top-4 left-4 z-30 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="bg-white p-2 rounded-md shadow-md text-gray-700"
          >
            ☰
          </button>
        </div>

        {/* Loading Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: isOpen ? 0 : -100, opacity: isOpen ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="Menu flex flex-col justify-between shadow min-h-screen max-h-screen p-4 bg-white fixed lg:static inset-y-0 left-0 z-20 w-64 overflow-hidden"
        >
          <div className="menu-upper-section space-y-4 overflow-visible">
            {/* Logo */}
            <div className="flex items-center justify-start">
              <img className="w-[60px] align-left" src={dashlogo} alt="Logo" />
            </div>
            
            {/* Loading Profile */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm w-[200px] mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="mt-3 text-center w-full">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-gray-500">Loading...</div>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      {/* Mobile burger menu */}
      <div className="fixed top-4 left-4 z-30 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="bg-white p-2 rounded-md shadow-md text-gray-700"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: isOpen ? 0 : -100, opacity: isOpen ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="Menu flex flex-col justify-between shadow min-h-screen max-h-screen p-4 bg-white fixed lg:static inset-y-0 left-0 z-20 w-64 overflow-hidden"
      >
        <div className="menu-upper-section space-y-4 overflow-visible">
          {/* Logo */}
          <div className="flex items-center justify-start">
                <img className="w-[60px] align-left" src={dashlogo} alt="Logo" />
          </div>
          
          {/* Modern Teacher Profile */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm w-[200px] mx-auto">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img 
                  src={safeTeacher.avatar || "https://via.placeholder.com/80x80?text=T"} 
                  alt={safeTeacher.name} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80x80?text=T";
                  }}
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${xpStatus.color}`}>
                    <Award size={14} className="text-white" />
                  </div>
                </div>
              </div>
              
              <div className="mt-3 text-center w-full">
                <div className="font-semibold text-gray-800 text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                  {safeTeacher.name}
                </div>
                <div className="text-xs text-gray-500 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  {safeTeacher.email}
                </div>
                
                {/* XP Badge */}
                <div className="flex items-center justify-center gap-2 mt-2 flex-nowrap">
                  <div className={`${xpStatus.color} text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap overflow-visible`}>
                    <Sparkles size={12} className="flex-shrink-0" />
                    <span className="whitespace-nowrap">{xpStatus.level}</span>
                  </div>
                  <div className="bg-green-400 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap overflow-visible">
                    <span className="whitespace-nowrap overflow-visible">{safeTeacher.xpPoints || 0} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="menu-links-container">
            <h1 className="text-gray-600 font-semibold mb-2 whitespace-nowrap">Overview</h1>
            <div className="menu-links flex flex-col gap-2 text-gray-700">
              <NavLink 
                to="/teachers/dashboard"
                className={({ isActive }) =>
                  `menu-link flex items-center gap-2 transition p-2 rounded-lg ${
                    isActive ? 'bg-blue-50 text-[#0B3D91] font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-[#0B3D91]'
                  } whitespace-nowrap overflow-visible`
                }
              >
                <LayoutDashboard size={18} className="flex-shrink-0" /> <span className="whitespace-nowrap overflow-visible">Dashboard</span>
              </NavLink>
              
              <NavLink 
                to="/teachers/add-course"
                className={({ isActive }) =>
                  `menu-link flex items-center gap-2 transition p-2 rounded-lg ${
                    isActive ? 'bg-blue-50 text-[#0B3D91] font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-[#0B3D91]'
                  } whitespace-nowrap overflow-visible`
                }
              >
                <Plus size={18} className="flex-shrink-0" /> <span className="whitespace-nowrap overflow-visible">Add Course</span>
              </NavLink>
              
              <NavLink 
                to="/teachers/manage-courses"
                className={({ isActive }) =>
                  `menu-link flex items-center gap-2 transition p-2 rounded-lg ${
                    isActive ? 'bg-blue-50 text-[#0B3D91] font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-[#0B3D91]'
                  } whitespace-nowrap overflow-visible`
                }
              >
                <BookOpen size={18} className="flex-shrink-0" /> <span className="whitespace-nowrap overflow-visible">Manage Courses</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="menu-lower-section">
          <h1 className="text-gray-600 font-semibold mb-2 whitespace-nowrap">Settings</h1>
          <div className="flex flex-col gap-2 text-gray-700 justify-center items-start">
            <button
              onClick={toggleSettings}
              className="flex items-center gap-2 hover:text-[#0B3D91] transition p-2 w-full rounded-lg hover:bg-gray-50 whitespace-nowrap overflow-visible"
            >
              <Settings size={18} className="flex-shrink-0" /> <span className="whitespace-nowrap overflow-visible">Settings</span>
            </button>
            <button
              className="flex items-center gap-2 hover:text-red-600 transition p-2 w-full rounded-lg hover:bg-gray-50 whitespace-nowrap overflow-visible"
            >
              <LogOut size={18} className="flex-shrink-0" /> <span className="whitespace-nowrap overflow-visible">Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Settings Modal */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white rounded-xl shadow-lg w-[90%] max-w-md relative p-4"
          >
            <button onClick={toggleSettings} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#0B3D91] hover:bg-blue-800 text-white py-2 rounded-md transition"
              >
                Save Changes
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;