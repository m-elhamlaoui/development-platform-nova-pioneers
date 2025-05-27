import React, { useState } from 'react';
import { Users, UserCheck, AlertTriangle, Home, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import np_logo from "../assets/np-logo.png";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from storage
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    // { icon: Users, label: 'Manage Users', path: '/admin/manage-users' },
    { icon: UserCheck, label: 'Confirm Teachers', path: '/admin/confirm-teachers' },
    // { icon: AlertTriangle, label: 'Manage Alerts', path: '/admin/manage-alerts' }
  ];

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className={`bg-gradient-to-b from-blue-900 to-indigo-900 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } min-h-screen relative shadow-2xl`}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${!isOpen && 'justify-center'}`}>
            <img 
              src={np_logo} 
              alt="Nova Pioneers" 
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            {isOpen && (
              <div>
                <h2 className="text-lg font-bold">Admin Panel</h2>
                <p className="text-xs text-blue-200">Nova Pioneers</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-white text-blue-900 shadow-lg' 
                  : 'hover:bg-blue-800 hover:shadow-md'
              }`}
            >
              <Icon 
                size={20} 
                className={`${isActive ? 'text-blue-900' : 'text-blue-200'} group-hover:scale-110 transition-transform`}
              />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`ml-3 font-medium ${
                    isActive ? 'text-blue-900' : 'text-white'
                  }`}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="absolute bottom-16 left-0 right-0 px-2">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-4 py-3 mx-2 rounded-lg transition-all duration-200 hover:bg-red-700 hover:shadow-md group`}
        >
          <LogOut 
            size={20} 
            className="text-red-300 group-hover:scale-110 transition-transform"
          />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-3 font-medium text-white"
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className={`text-center ${!isOpen && 'hidden'}`}>
          <p className="text-xs text-blue-200">© 2025 Nova Pioneers</p>
          <p className="text-xs text-blue-300">Admin Dashboard</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;