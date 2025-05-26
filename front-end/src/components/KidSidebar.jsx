import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, GraduationCap, Award, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import dashlogo from "../assets/np-logo.png";

const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:9093' : 'http://141.144.226.68:9093'; // Replace with your actual production API URL
};


const KidSidebar = ({ baseUrl = getApiBaseUrl() }) => {
  const [kidData, setKidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
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
  
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  // Determine badge based on XP with beautiful titles
  const determineBadge = (xp) => {
    const numXp = Number(xp) || 0;
    
    if (numXp >= 2000) return "🌟 Master Explorer";
    if (numXp >= 1500) return "🏆 Champion Pioneer";
    if (numXp >= 1000) return "💎 Expert Adventurer";
    if (numXp >= 750) return "🚀 Space Pioneer";
    if (numXp >= 500) return "🔥 Advanced Explorer";
    if (numXp >= 300) return "⭐ Rising Star";
    if (numXp >= 150) return "🌱 Growing Pioneer";
    if (numXp >= 50) return "🎯 Junior Explorer";
    return "🌟 New Pioneer";
  };
  
  // Determine badge color with gradients
  const determineBadgeColor = (xp) => {
    const numXp = Number(xp) || 0;
    
    if (numXp >= 2000) return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
    if (numXp >= 1500) return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
    if (numXp >= 1000) return "bg-gradient-to-r from-blue-500 to-purple-600 text-white";
    if (numXp >= 750) return "bg-gradient-to-r from-indigo-500 to-blue-600 text-white";
    if (numXp >= 500) return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
    if (numXp >= 300) return "bg-gradient-to-r from-green-400 to-blue-500 text-white";
    if (numXp >= 150) return "bg-gradient-to-r from-green-400 to-green-600 text-white";
    if (numXp >= 50) return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
    return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
  };
  
  // Fetch kid data from backend
  useEffect(() => {
    const fetchKidData = async () => {
      if (!kidId) {
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        const response = await fetch(`${baseUrl}/kids/${kidId}/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch kid data: ${response.status}`);
        }

        const data = await response.json();
        setKidData(data);
      } catch (err) {
        console.error("Error fetching kid data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKidData();
  }, [kidId, baseUrl]);
  
  // Calculate progress to next badge
  const calculateNextBadgeProgress = (xp) => {
    const numXp = Number(xp) || 0;
    
    if (numXp >= 2000) return 100; // Max level
    if (numXp >= 1500) return Math.min(100, ((numXp - 1500) / (2000 - 1500)) * 100);
    if (numXp >= 1000) return Math.min(100, ((numXp - 1000) / (1500 - 1000)) * 100);
    if (numXp >= 750) return Math.min(100, ((numXp - 750) / (1000 - 750)) * 100);
    if (numXp >= 500) return Math.min(100, ((numXp - 500) / (750 - 500)) * 100);
    if (numXp >= 300) return Math.min(100, ((numXp - 300) / (500 - 300)) * 100);
    if (numXp >= 150) return Math.min(100, ((numXp - 150) / (300 - 150)) * 100);
    if (numXp >= 50) return Math.min(100, ((numXp - 50) / (150 - 50)) * 100);
    return Math.min(100, (numXp / 50) * 100);
  };
  
  // Get next badge name
  const getNextBadgeName = (xp) => {
    const numXp = Number(xp) || 0;
    
    if (numXp >= 2000) return null; // Already at max level
    if (numXp >= 1500) return "🌟 Master Explorer";
    if (numXp >= 1000) return "🏆 Champion Pioneer";
    if (numXp >= 750) return "💎 Expert Adventurer";
    if (numXp >= 500) return "🚀 Space Pioneer";
    if (numXp >= 300) return "🔥 Advanced Explorer";
    if (numXp >= 150) return "⭐ Rising Star";
    if (numXp >= 50) return "🌱 Growing Pioneer";
    return "🎯 Junior Explorer";
  };
  
  // Get XP to next badge
  const getXpToNextBadge = (xp) => {
    const numXp = Number(xp) || 0;
    
    if (numXp >= 2000) return 0; // Already at max level
    if (numXp >= 1500) return 2000 - numXp;
    if (numXp >= 1000) return 1500 - numXp;
    if (numXp >= 750) return 1000 - numXp;
    if (numXp >= 500) return 750 - numXp;
    if (numXp >= 300) return 500 - numXp;
    if (numXp >= 150) return 300 - numXp;
    if (numXp >= 50) return 150 - numXp;
    return 50 - numXp;
  };
  
  return (
    <>
      <motion.div
        initial={{ x: collapsed ? -250 : 0 }}
        animate={{ x: collapsed ? -250 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`bg-white border-r border-gray-200 h-screen ${collapsed ? 'w-0' : 'w-[270px]'} flex-shrink-0 sticky top-0 z-10`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Kid Info */}
          <div className="p-4 text-center border-b border-gray-200">
            <img 
              src={dashlogo} 
              alt="Nova Pioneers Logo" 
              className="w-16 h-16 mx-auto rounded-full object-cover border-4 border-blue-600" 
            />
            
            {!loading && kidData ? (
              <div className="mt-3">
                <h2 className="font-bold text-lg">
                  {kidData.first_name} {kidData.last_name}
                </h2>
                <span className={`inline-block mt-1 px-3 py-1 ${determineBadgeColor(kidData.total_xp)} text-xs rounded-full font-medium`}>
                  {kidData.title || determineBadge(kidData.total_xp)}
                </span>
                
                {/* XP Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>⚡ {kidData.total_xp?.toLocaleString() || 0} XP</span>
                    {getNextBadgeName(kidData.total_xp) && (
                      <span>{getXpToNextBadge(kidData.total_xp)?.toLocaleString()} to next</span>
                    )}
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                      style={{width: `${calculateNextBadgeProgress(kidData.total_xp)}%`}}
                    ></div>
                  </div>
                  {getNextBadgeName(kidData.total_xp) && (
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      Next: {getNextBadgeName(kidData.total_xp)}
                    </div>
                  )}
                  {!getNextBadgeName(kidData.total_xp) && (
                    <div className="text-xs text-purple-600 mt-1 text-center font-medium">
                      🏆 Max Level Achieved!
                    </div>
                  )}
                </div>
              </div>
            ) : loading ? (
              <div className="mt-3 flex flex-col items-center">
                <div className="animate-pulse w-32 h-5 bg-gray-200 rounded-md mb-2"></div>
                <div className="animate-pulse w-20 h-6 bg-gray-200 rounded-full"></div>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-red-500">Failed to load profile</p>
              </div>
            )}
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              <li>
                <Link 
                  to="/kid/dashboard" 
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.pathname === '/kid/dashboard' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
              </li>
              {/* <li>
                <Link 
                  to="/kid/my-courses" 
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.pathname === '/my-courses' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 mr-3" />
                  My Courses
                </Link>
              </li>
              <li>
                <Link 
                  to="/achievements" 
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.pathname === '/achievements' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Award className="w-5 h-5 mr-3" />
                  Achievements
                </Link>
              </li> */}
            </ul>
          </nav>
          
          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/kid/settings" 
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
      
      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed left-[270px] bottom-4 z-20 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-50"
        style={{ left: collapsed ? '1rem' : '270px' }}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </>
  );
};

export default KidSidebar;