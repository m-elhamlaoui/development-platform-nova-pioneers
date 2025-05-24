import { useState } from "react";
import { motion } from "framer-motion";
import dashlogo from "../../assets/np-logo.png";
import { Link, NavLink } from "react-router-dom";
import { House, BookMarked, Baby, Heart, Settings, LogOut, X } from "lucide-react";

export default function Menu() {
  const [showSettings, setShowSettings] = useState(false);
  const [profile, setProfile] = useState({ name: "Zakaria OUMGHAR", email: "zakaria@example.com" });

  const toggleSettings = () => setShowSettings(!showSettings);
  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSettings(false);
    console.log("Updated Profile:", profile); // replace with API call if needed
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

                            {/* <Link className="menu-link flex items-center gap-2 hover:text-red-600 transition"> <Heart size={20} /> <p>Favorites</p></Link> */}
            </div>
          </div>
          <div className="children-container">
            <h1 className="text-gray-600 font-semibold mb-2">Children</h1>
            <div className="children-list-container flex flex-col gap-2">
              {[1, 2].map((_, i) => (
                <Link key={i} className="child-link flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100" >
                  <img className="w-[45px] rounded-full" src={dashlogo} alt="Child" />
                  <div>
                    <div className="font-semibold text-sm">Zakaria OUMGHAR</div>
                    <div className="text-xs text-gray-500">94830 XP</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="menu-lower-section">
          <h1 className="text-gray-600 font-semibold mb-2">Settings</h1>
          <div className="flex flex-col gap-3 text-gray-700 justify-center items-start">
            <Link onClick={toggleSettings} className="flex items-center gap-2 hover:text-blue-600 transition ">
              <Settings size={20} /> <p>Settings</p>
            </Link>
            <Link className="flex items-center gap-2 hover:text-red-600 transition">
              <LogOut size={20} /> <p>Log out</p>
            </Link>
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
            className="bg-white rounded-xl shadow-lg w-[90%] max-w-md relative " 
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
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                  style={{padding: "5px"}}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                  style={{padding: "5px"}}

                />
              </div>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition"
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