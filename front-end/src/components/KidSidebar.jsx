import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, GraduationCap, Award, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import dashlogo from "../assets/np-logo.png";

const KidSidebar = ({ baseUrl = "http://localhost:9093" }) => {
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
  
  // Determine badge based on XP
  const determineBadge = (xp) => {
    // Ensure xp is a number
    const numXp = Number(xp) || 0;
    
    if (numXp >= 30000) return 'Astronaut';
    if (numXp >= 15000) return 'Explorer';
    if (numXp >= 5000) return 'Scientist';
    if (numXp >= 1000) return 'Champion';
    return 'Beginner';
  };
  
  // Determine badge color
  const determineBadgeColor = (xp) => {
    // Ensure xp is a number
    const numXp = Number(xp) || 0;
    
    if (numXp >= 30000) return 'bg-black';
    if (numXp >= 15000) return 'bg-green-400';
    if (numXp >= 5000) return 'bg-purple-500';
    if (numXp >= 1000) return 'bg-yellow-500';
    return 'bg-blue-400';
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
    
    if (numXp >= 30000) return 100; // Max level
    if (numXp >= 15000) return Math.min(100, ((numXp - 15000) / (30000 - 15000)) * 100);
    if (numXp >= 5000) return Math.min(100, ((numXp - 5000) / (15000 - 5000)) * 100);
    if (numXp >= 1000) return Math.min(100, ((numXp - 1000) / (5000 - 1000)) * 100);
    return Math.min(100, (numXp / 1000) * 100);
  };
  
  // Get next badge name
  const getNextBadgeName = (xp) => {
    const numXp = Number(xp) || 0;
    
    if (numXp >= 30000) return null; // Already at max level
    if (numXp >= 15000) return 'Astronaut';
    if (numXp >= 5000) return 'Explorer';
    if (numXp >= 1000) return 'Scientist';
    return 'Champion';
  };
  
  // Get XP to next badge
  const getXpToNextBadge = (xp) => {
    const numXp = Number(xp) || 0;
    
    if (numXp >= 30000) return 0; // Already at max level
    if (numXp >= 15000) return 30000 - numXp;
    if (numXp >= 5000) return 15000 - numXp;
    if (numXp >= 1000) return 5000 - numXp;
    return 1000 - numXp;
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
                <span className={`inline-block mt-1 px-3 py-1 ${determineBadgeColor(kidData.total_xp)} text-white text-xs rounded-full`}>
                  {determineBadge(kidData.total_xp)}
                </span>
                
                {/* XP Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{kidData.total_xp?.toLocaleString() || 0} XP</span>
                    {getNextBadgeName(kidData.total_xp) && (
                      <span>{getXpToNextBadge(kidData.total_xp)?.toLocaleString()} XP to {getNextBadgeName(kidData.total_xp)}</span>
                    )}
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{width: `${calculateNextBadgeProgress(kidData.total_xp)}%`}}
                    ></div>
                  </div>
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
                    location.pathname === '/dashboard' 
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