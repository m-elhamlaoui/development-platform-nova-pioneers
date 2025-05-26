import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import dashlogo from "../assets/np-logo.png";

export default function ParentsSide({ parentData, kidsData, onCreateKid }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showAddKidForm, setShowAddKidForm] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [kidForm, setKidForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    is_restricted: 0,
    profile_picture: '' // Optional
  });

  // Update profile from parentData when it's available
  React.useEffect(() => {
    if (parentData) {
      setProfile({
        name: `${parentData.first_name} ${parentData.last_name}`,
        email: parentData.email
      });
    }
  }, [parentData]);

  const toggleSettings = () => setShowSettings(!showSettings);
  const toggleAddKidForm = () => setShowAddKidForm(!showAddKidForm);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleKidFormChange = (e) => {
    let value;
    if (e.target.type === 'checkbox') {
      // Convert boolean to integer 0/1 for is_restricted
      value = e.target.checked ? 1 : 0;
    } else {
      value = e.target.value;
    }
    setKidForm({ ...kidForm, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSettings(false);
    toast.info("Profile update functionality to be implemented");
  };

  const handleAddKid = async (e) => {
    e.preventDefault();
    
    try {
      // Make sure all required fields are filled
      if (!kidForm.email || !kidForm.password || !kidForm.first_name || !kidForm.last_name || !kidForm.birth_date) {
        toast.error("Please fill all required fields");
        return;
      }
      
      // When handling date input:
      const formattedBirthDate = new Date(kidForm.birth_date).toISOString().split('T')[0];
      console.log(parentData, "Parent Data for Kid Creation");
      await onCreateKid({
        // parent_id: parentData.id,
        email: kidForm.email,
        password: kidForm.password,
        first_name: kidForm.first_name,
        last_name: kidForm.last_name,
        birth_date: formattedBirthDate,
        is_restricted: parseInt(kidForm.is_restricted) // Ensure it's an integer
      });
      setShowAddKidForm(false);
      setKidForm({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        birth_date: '',
        is_restricted: 0,
        profile_picture: '' // Optional
      });
      
    } catch (err) {
      console.error("Failed to add kid:", err);
    }
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
            <p className="text-xs text-gray-600 text-center">parents dashboard</p>

            <h1 className="text-gray-900 font-semibold mt-2 text-center">{profile.name}</h1>
            <h1 className="text-gray-900 font-thin  text-center">{profile.email}</h1>
            
          </div>
          
          {/* <div className="children-container">
            <div className="flex justify-between items-center">
              <h1 className="text-gray-600 font-semibold mb-2">My Kids</h1>
              <button 
                onClick={toggleAddKidForm}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                + Add
              </button>
            </div>
            
            <div className="children-list-container flex flex-col gap-2">
              {kidsData && kidsData.length > 0 ? (
                kidsData.map((kid) => (
                  <div key={kid.user_id} className="child-link flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                    <div className="p-1 bg-[#0b3d91] rounded-full">
                      <img className="w-10 h-10 rounded-full" 
                          src={kid.profile_picture || dashlogo} 
                          alt={`${kid.first_name} ${kid.last_name}`} />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium">{kid.first_name} {kid.last_name}</h2>
                      <span className={`text-xs px-2 py-0.5 ${
                        kid.title === "Space Newby" ? "bg-gray-400" :
                        kid.title === "Explorer" ? "bg-green-400" :
                        kid.title === "Astronaut" ? "bg-black" :
                        "bg-blue-400"
                      } text-white rounded`}>
                        {kid.title || "Space Newby"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 text-center py-2">
                  No kids added yet
                </div>
              )}
            </div>
          </div>
           */}
          {/* <div className="help-container mt-5">
            <h1 className="text-gray-600 font-semibold mb-2">Help</h1>
            <div className="help-list flex flex-col gap-2">
              <button className="help-link text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
                FAQ
              </button>
              <button className="help-link text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
                Contact Support
              </button>
              <button className="help-link text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
                User Guide
              </button>
            </div>
          </div> */}
        </div>
{/* 
        <div className="ParentsSide-bottom-section">
          <button 
            onClick={toggleSettings}
            className="settings-button w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Settings
          </button>
        </div> */}
      </motion.div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <button onClick={toggleSettings} className="text-gray-600 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  readOnly
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Kid Modal */}
      {showAddKidForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add a Kid</h2>
              <button onClick={toggleAddKidForm} className="text-gray-600 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddKid}>
              <div className="mb-4">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                <input 
                  type="text" 
                  id="first_name" 
                  name="first_name" 
                  value={kidForm.first_name}
                  onChange={handleKidFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                <input 
                  type="text" 
                  id="last_name" 
                  name="last_name" 
                  value={kidForm.last_name}
                  onChange={handleKidFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={kidForm.email}
                  onChange={handleKidFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={kidForm.password}
                  onChange={handleKidFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-1">Birth Date*</label>
                <input 
                  type="date" 
                  id="birth_date" 
                  name="birth_date" 
                  value={kidForm.birth_date}
                  onChange={handleKidFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input 
                  type="checkbox" 
                  id="is_restricted" 
                  name="is_restricted" 
                  checked={kidForm.is_restricted === 1} // Explicitly compare with 1
                  onChange={handleKidFormChange}
                  className="mr-2"
                />
                <label htmlFor="is_restricted" className="text-sm text-gray-700">Restrict access to assigned courses only</label>
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Add Kid
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}