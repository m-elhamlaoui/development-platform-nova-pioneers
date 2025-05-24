import { useState } from "react";
import { motion } from "framer-motion";
import dashlogo from "../assets/np-logo.png";
import { Link } from "react-router-dom";
import { House, BookMarked, Baby, Heart, Settings, LogOut, X } from "lucide-react";

export default function ParentsSide() {
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
      {/* Sidebar ParentsSide */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="ParentsSide flex flex-col justify-between shadow min-h-screen max-h-screen p-4 bg-white px-6"
      
      >
        <div className="ParentsSide-upper-section space-y-4">
          <img className="dash-logo w-[120px] rounded-[100px] m-auto border-9 border-double border-blue-900" src={dashlogo} alt="Logo" />
          <div className="ParentsSide-links-container mt-5">
            <h1 className="text-gray-900 font-semibold mt-2 text-center">{profile.name}</h1>
              <p className="text-xs text-gray-600 text-center">parents dashboard</p>
          </div>
          <div className="children-container">
            <h1 className="text-gray-600 font-semibold mb-2 text-center">Mentors</h1>
            <div className="children-list-container flex flex-col gap-2">
              {[1, 2].map((_, i) => (
                <Link key={i} className="child-link flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100" >
                  <img className="w-[45px] rounded-full" src={dashlogo} alt="Child" />
                  <div>
                    <div className="font-semibold text-sm">Zakaria OUMGHAR</div>
                    <div className="teacher-cred flex gap-1">
                    <div className="text-[11px] text-white bg-green-500 px-2 py-1 rounded-xl">94830 XP</div>
                    <div className="text-[11px] text-white bg-gray-900 px-2 py-1 rounded-xl">4.5 <span className="text-s text-[#FFC83D]">★</span></div>

                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

 
      </motion.div>
              
    
    </>
  );
}