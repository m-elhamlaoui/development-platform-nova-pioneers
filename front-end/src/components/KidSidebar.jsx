import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Award, 
  Settings, 
  LogOut, 
  ChevronRight,
  User,
  Star,
  ChevronDown,
  X,
  Rocket,
  Globe, // Replacing Planet with Globe which exists in lucide-react
  UserCheck,
  Mail
} from 'lucide-react';

const KidSidebar = ({ kidData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Mock space titles
  const spaceTitles = [
    "Nova Explorer", 
    "Star Voyager", 
    "Cosmic Ranger", 
    "Galaxy Pioneer",
    "Asteroid Adventurer"
  ];
  
  // Use title from kidData or a default one
  const spaceTitle = kidData.title || spaceTitles[0];
  
  const sidebarItems = [
    { 
      icon: <Home size={20} />, 
      name: 'Dashboard', 
      path: '/kid/dashboard' 
    },
    
  ];
  
  const handleLogout = () => {
    // Implement logout functionality
    navigate('/login');
  };
  
  // Form state for settings modal
  const [formData, setFormData] = useState({
    name: kidData.name || '',
    email: kidData.email || ''
  });
  
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    // Here you would typically update user data via API
    console.log('Updated settings:', formData);
    // Close modal after saving
    setShowSettingsModal(false);
  };
  
  return (
    <>
      <motion.div
        initial={{ width: expanded ? 250 : 80 }}
        animate={{ width: expanded ? 250 : 80 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold text-blue-600"
              >
                Nova Kids
              </motion.div>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>
        
        {/* Space-themed user profile */}
        <div className={`px-4 mb-6 ${expanded ? 'py-4' : 'py-2 flex justify-center'}`}>
          <div className={`flex ${expanded ? 'flex-row' : 'flex-col'} items-center`}>
            <div className={`flex-shrink-0 relative ${expanded ? 'mr-3' : 'mb-2'}`}>
              {/* Space-themed profile icon */}
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                  <div className="absolute top-3 left-6 w-0.5 h-0.5 bg-white rounded-full"></div>
                  <div className="absolute top-5 left-2 w-0.5 h-0.5 bg-white rounded-full"></div>
                  <div className="absolute top-7 left-4 w-1 h-1 bg-white rounded-full"></div>
                  <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-white rounded-full"></div>
                  <div className="absolute bottom-2 left-3 w-1 h-1 bg-white rounded-full"></div>
                </div>
                <Rocket className="w-6 h-6 rotate-45" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-white"></div>
            </div>
            
            {expanded && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium text-gray-800 truncate">{kidData.name}</span>
                <span className="text-xs text-indigo-600 font-medium">{spaceTitle}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="px-2 flex-grow">
          {sidebarItems.map((item) => (
            <div key={item.name}>
              <Link
                to={item.hasDropdown ? '#' : item.path}
                onClick={item.hasDropdown ? item.toggle : undefined}
                className={`flex items-center py-2 px-3 mb-1 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                
                {expanded && (
                  <>
                    <span className="ml-3 flex-1">{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${item.isOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </>
                )}
              </Link>
              
              {/* Dropdown items */}
              {expanded && item.hasDropdown && item.isOpen && item.children && (
                <div className="ml-9 space-y-1 mt-1 mb-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.path}
                      className={`block text-sm py-2 px-3 rounded-lg transition-colors ${
                        location.pathname === child.path
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Bottom actions: Settings and Logout */}
        <div className="px-2 pt-4 pb-4 border-t border-gray-100 mt-auto">
          {/* Settings Button - Now at bottom */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className={`flex items-center py-2 px-3 mb-2 w-full rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${
              !expanded && 'justify-center'
            }`}
          >
            <Settings size={20} />
            {expanded && <span className="ml-3">Settings</span>}
          </button>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center py-2 px-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
              !expanded && 'justify-center'
            }`}
          >
            <LogOut size={20} />
            {expanded && <span className="ml-3">Log Out</span>}
          </button>
        </div>
      </motion.div>
      
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSettingsSubmit} className="p-5">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 flex items-center justify-center text-white overflow-hidden">
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full"></div>
                        <div className="absolute top-6 left-12 w-1 h-1 bg-white rounded-full"></div>
                        <div className="absolute top-10 left-4 w-1 h-1 bg-white rounded-full"></div>
                        <div className="absolute top-14 left-8 w-1.5 h-1.5 bg-white rounded-full"></div>
                        <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full"></div>
                        <div className="absolute bottom-4 left-6 w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <Rocket className="w-12 h-12 rotate-45" />
                    </div>
                    
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCheck size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
         
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KidSidebar;