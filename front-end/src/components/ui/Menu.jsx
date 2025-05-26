import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dashlogo from "../../assets/np-logo.png";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { House, BookMarked, Baby, Settings, LogOut, X } from "lucide-react";
import { toast } from "react-toastify";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [kidsData, setKidsData] = useState([]);
  
  // Create function to display initials for avatars
  const getInitialsAvatar = (firstName, lastName) => {
    if (!firstName && !lastName) return '';
    
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  // Load user data from localStorage/sessionStorage
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    
    setProfile({
      name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
      email: userData.email || "",
      userId: userData.id
    });
    
    // Fetch kids data
    fetchKids(token, userData.id);
  }, [navigate]);
  
  // Fetch kids from API
  const fetchKids = async (token, parentId) => {
    try {
      console.log("Fetching kids for parent ID:", parentId);
      const response = await fetch(`http://localhost:9093/parents/${parentId}/kids`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error(`Failed to fetch kids: ${response.status}`);
      }
      
      const kids = await response.json();
      console.log("Fetched kids:", kids);
      setKidsData(kids);
    } catch (err) {
      console.error("Error fetching kids:", err);
    }
  };

  const toggleSettings = () => setShowSettings(!showSettings);
  
  const handleChange = (e) => setProfile({ 
    ...profile, 
    [e.target.name]: e.target.value 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      // Call API to update profile
      const response = await fetch(`http://localhost:9093/users/me`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: profile.name.split(" ")[0],
          last_name: profile.name.split(" ").slice(1).join(" ")
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      
      toast.success("Profile updated successfully");
      setShowSettings(false);
      
      // Update local storage user data
      const userData = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
      const nameParts = profile.name.split(" ");
      userData.firstName = nameParts[0];
      userData.lastName = nameParts.slice(1).join(" ");
      
      if (localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("user", JSON.stringify(userData));
      }
      
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile");
    }
  };
  
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    
    // Show toast notification
    toast.info("You've been logged out");
    
    // Redirect to login page
    navigate("/login");
  };

  return (
    <>
      {/* Sidebar Menu */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="Menu flex flex-col justify-between shadow min-h-screen max-h-screen p-4 bg-white"
      >
        <div className="menu-upper-section space-y-4">
          <img className="dash-logo w-[60px]" src={dashlogo} alt="Logo" />
          <div className="menu-links-container">
            <h1 className="text-gray-600 font-semibold mb-2">Overview</h1>
            <div className="menu-links flex flex-col gap-2 text-gray-700">
              <NavLink
                to="/parents-dashboard"
                end
                className={({ isActive }) =>
                  `menu-link flex items-center gap-2 transition ${
                    isActive ? 'text-[#0B3D91] font-semibold' : 'text-gray-700 hover:text-[#0B3D91]'
                  }`
                }
              >
                <House size={20} /> <p>Dashboard</p>
              </NavLink>

              <NavLink
                to="/parents-dashboard/lessons"
                className={({ isActive }) =>
                  `menu-link flex items-center gap-2 transition ${
                    isActive ? 'text-[#0B3D91] font-semibold' : 'text-gray-700 hover:text-[#0B3D91]'
                  }`
                }
              >
                <BookMarked size={20} /> <p>Lessons</p>
              </NavLink>
              
              <NavLink
                to="/parents-dashboard/kids"
                className={({ isActive }) =>
                  `menu-link flex items-center gap-2 transition ${
                    isActive ? 'text-[#0B3D91] font-semibold' : 'text-gray-700 hover:text-[#0B3D91]'
                  }`
                }
              >
                <Baby size={20} /> <p>My kids</p>
              </NavLink>
            </div>
          </div>
          
          {/* Kids section - now with initials avatar */}
          {/* <div className="children-container">
            <h1 className="text-gray-600 font-semibold mb-2">Children</h1>
            <div className="children-list-container flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              <ul className="w-full">
              
                {kidsData && kidsData.length > 0 ? (
                  kidsData
                    .filter(kid => kid !== null && kid !== undefined)
                    .map((kid) => (
                      <li key={kid.user_id || Math.random()} className="mb-2">
                        <Link 
                          to={`/kids/${kid.user_id}`}
                          className={`block px-4 py-2 rounded-lg text-sm ${
                            location.pathname.includes(`/kids/${kid.user_id}`) 
                              ? "bg-blue-100 text-blue-800" 
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-100 text-blue-800">
                              {kid.first_name ? kid.first_name.charAt(0) : "K"}
                            </div>
                            {kid.first_name || "Kid"}'s Dashboard
                          </div>
                        </Link>
                      </li>
                    ))
                ) : (
                  <li className="text-sm text-gray-500 italic px-4">
                    No kids added yet
                  </li>
                )}
              </ul>
            </div>
          </div> */}
        </div>

        <div className="menu-lower-section">
          <h1 className="text-gray-600 font-semibold mb-2">Settings</h1>
          <div className="flex flex-col gap-3 text-gray-700 justify-center items-start">
            <button 
              onClick={toggleSettings} 
              className="flex items-center gap-2 hover:text-blue-600 transition w-full text-left"
            >
              <Settings size={20} /> <p>Settings</p>
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 hover:text-red-600 transition w-full text-left"
            >
              <LogOut size={20} /> <p>Log out</p>
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
            className="bg-white rounded-xl shadow-lg w-[90%] max-w-md relative" 
            style={{padding: "15px"}}
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
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  readOnly
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
              >
                Save Changes
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}