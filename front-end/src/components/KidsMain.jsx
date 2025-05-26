import React, { useState, useEffect } from 'react';
import { Search, User, Plus, Trash2, X, Edit, Loader2 } from "lucide-react";
import { toast } from 'react-toastify';
const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:9093' : 'http://http://141.144.226.68:9093'; // Replace with your actual production API URL
};

export default function KidsMain({ baseUrl = getApiBaseUrl() }) {
  // State for kids data
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBadge, setFilterBadge] = useState('');
  
  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Current parent ID from local storage - more robust implementation
  const getUserId = () => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user') || '{}';
      const user = JSON.parse(userStr);
      return user?.id || null;
    } catch (err) {
      console.error('Error parsing user data:', err);
      return null;
    }
  };
  
  const currentParentId = getUserId();
  
  // State for new kid details
  const [kidForm, setKidForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    is_restricted: 0,
    parent_id: currentParentId
  });
  
  // State for editing kid
  const [editingKidForm, setEditingKidForm] = useState(null);

  // Handle form changes
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

  // Handle edit form changes
  const handleEditFormChange = (e) => {
    let value;
    if (e.target.type === 'checkbox') {
      value = e.target.checked ? 1 : 0;
    } else {
      value = e.target.value;
    }
    setEditingKidForm({ ...editingKidForm, [e.target.name]: value });
  };

  // Fetch kids data from backend with robust error handling
  useEffect(() => {
    const fetchKids = async () => {
      if (!currentParentId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        const response = await fetch(`${baseUrl}/parents/${currentParentId}/kids`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch kids: ${response.status}`);
        }

        const kidsData = await response.json();
        console.log("Fetched kids data:", kidsData);
        
        // Filter out any null entries that might exist
        const validKidsData = Array.isArray(kidsData) 
          ? kidsData.filter(kid => kid !== null && kid !== undefined) 
          : [];
          
        setKids(validKidsData);
      } catch (err) {
        console.error("Error fetching kids:", err);
        toast.error(`Failed to load kids: ${err.message}`);
        // Set empty array on error to prevent undefined errors
        setKids([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKids();
  }, [baseUrl, currentParentId]);
  
  // Safe date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      console.error("Date formatting error:", err);
      return "Invalid date";
    }
  };
  
  // Determine badge based on XP
  const determineBadge = (xp) => {
    // Ensure xp is a number
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
  
  // Determine badge color based on XP
  const determineBadgeColor = (xp) => {
    // Ensure xp is a number
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
 

  // Function to delete a kid with improved error handling
  const deleteKid = async (kidUserId) => {
    if (!kidUserId) {
      toast.error("Invalid kid ID");
      return;
    }
    
    if (!confirm("Are you sure you want to remove this kid? This action cannot be undone.")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const response = await fetch(`${baseUrl}/parents/${currentParentId}/kids/${kidUserId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete kid: ${response.status}`);
      }
      
      // Remove the kid from the local state
      setKids(prev => prev.filter(kid => kid && kid.user_id !== kidUserId));
      toast.success("Kid removed successfully");
    } catch (err) {
      console.error("Error deleting kid:", err);
      toast.error(`Failed to delete: ${err.message}`);
    }
  };
  
  // Function to open edit form with null checks
  const openEditForm = (kid) => {
    if (!kid || !kid.user_id) {
      toast.error("Cannot edit: Invalid kid data");
      return;
    }
    
    setEditingKidForm({
      user_id: kid.user_id,
      kid_id: kid.kid_id || null,
      email: kid.email || '',
      first_name: kid.first_name || '',
      last_name: kid.last_name || '',
      birth_date: kid.birth_date || '',
      is_restricted: kid.is_restricted || 0,
      password: '' // Don't populate password field
    });
    setShowEditForm(true);
  };
  
  // Function to save edit changes with improved error handling
  const saveEditChanges = async (e) => {
    e.preventDefault();
    
    if (!editingKidForm || !editingKidForm.user_id) {
      toast.error("Cannot update: Missing kid ID");
      return;
    }
    
    if (!editingKidForm.first_name?.trim() || !editingKidForm.last_name?.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      // Prepare data for API - only include fields that should be updated
      const kidData = {
        first_name: editingKidForm.first_name,
        last_name: editingKidForm.last_name,
        birth_date: editingKidForm.birth_date,
        is_restricted: parseInt(editingKidForm.is_restricted)
      };
      
      // Only include password if it was provided
      if (editingKidForm.password?.trim()) {
        kidData.password = editingKidForm.password;
      }
      
      const response = await fetch(`${baseUrl}/kids/${editingKidForm.user_id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(kidData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update kid: ${response.status}`);
      }
      
      // Update local state with the changes
      setKids(prevKids => 
        prevKids.map(kid => 
          kid && kid.user_id === editingKidForm.user_id ? { 
            ...kid,
            first_name: editingKidForm.first_name,
            last_name: editingKidForm.last_name,
            birth_date: editingKidForm.birth_date,
            is_restricted: editingKidForm.is_restricted
          } : kid
        )
      );
      
      toast.success("Kid updated successfully");
      setShowEditForm(false);
      setEditingKidForm(null);
    } catch (err) {
      console.error("Error updating kid:", err);
      toast.error(`Failed to update: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Function to add a new kid with improved error handling
  const handleAddKid = async (e) => {
    e.preventDefault();
    
    if (!kidForm.first_name?.trim() || !kidForm.last_name?.trim() || 
        !kidForm.birth_date?.trim() || !kidForm.email?.trim() || 
        !kidForm.password?.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      // Format date if needed
      let formattedBirthDate = kidForm.birth_date;
      try {
        formattedBirthDate = new Date(kidForm.birth_date).toISOString().split('T')[0];
      } catch (err) {
        console.warn("Date formatting error:", err);
      }
      
      // Prepare data for API
      const kidData = {
        parent_id: currentParentId,
        email: kidForm.email,
        password: kidForm.password,
        first_name: kidForm.first_name,
        last_name: kidForm.last_name,
        birth_date: formattedBirthDate,
        is_restricted: parseInt(kidForm.is_restricted)
      };
      
      const response = await fetch(`${baseUrl}/parents/${currentParentId}/kids`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(kidData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create kid: ${response.status}`);
      }
      
      const newKidData = await response.json();
      console.log("New kid created:", newKidData);
      
      // Refresh the kids list
      const kidsResponse = await fetch(`${baseUrl}/parents/${currentParentId}/kids`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (kidsResponse.ok) {
        const updatedKids = await kidsResponse.json();
        // Filter out any null entries that might exist
        const validUpdatedKids = Array.isArray(updatedKids) 
          ? updatedKids.filter(kid => kid !== null && kid !== undefined) 
          : [];
        setKids(validUpdatedKids);
      }
      
      toast.success("Kid added successfully");
      
      // Reset form and hide it
      setKidForm({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        birth_date: '',
        is_restricted: 0,
        parent_id: currentParentId
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding kid:", err);
      toast.error(`Failed to add: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter kids based on search term and selected badge with null checks
  const filteredKids = kids
    .filter(kid => kid !== null && kid !== undefined) // First ensure we have valid kids
    .filter(kid => {
      // Then apply the search and filter logic
      const fullName = `${kid.first_name || ''} ${kid.last_name || ''}`.toLowerCase();
      const username = (kid.username || kid.email || '').toLowerCase();
      const searchValue = searchTerm.toLowerCase();
      
      const matchesSearch = fullName.includes(searchValue) || username.includes(searchValue);
      
      const kidBadge = determineBadge(kid.total_xp || 0);
      const matchesBadge = filterBadge ? kidBadge === filterBadge : true;
      
      return matchesSearch && matchesBadge;
    });

  // Badge options for the forms
const badgeOptions = [
    { label: '🌟 New Pioneer', color: 'bg-gradient-to-r from-gray-400 to-gray-600' },
    { label: '🎯 Junior Explorer', color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
    { label: '🌱 Growing Pioneer', color: 'bg-gradient-to-r from-green-400 to-green-600' },
    { label: '⭐ Rising Star', color: 'bg-gradient-to-r from-green-400 to-blue-500' },
    { label: '🔥 Advanced Explorer', color: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { label: '🚀 Space Pioneer', color: 'bg-gradient-to-r from-indigo-500 to-blue-600' },
    { label: '💎 Expert Adventurer', color: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { label: '🏆 Champion Pioneer', color: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
    { label: '🌟 Master Explorer', color: 'bg-gradient-to-r from-purple-500 to-pink-500' }
  ];

  return (
    <div className='parents-main bg-gray-50' style={{flexGrow: 1, minHeight: "100vh", padding: "1.5rem"}}>
      {/* Search and filter UI */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="search-container flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm flex-grow w-full">
          <input 
            type="text" 
            className='search flex-grow px-4 py-2 outline-none text-gray-700' 
            placeholder='Search by name or username...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="text-gray-400" size={20} />
        </div>
        
        <select 
          className="p-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterBadge}
          onChange={(e) => setFilterBadge(e.target.value)}
        >
          <option value="">All Badges</option>
          {badgeOptions.map(badge => (
            <option key={badge.label} value={badge.label}>{badge.label}</option>
          ))}
        </select>
      </div>

      {/* Header section */}
      <div className="flex justify-between items-center my-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kids Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your children's accounts and track their progress</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3 rounded-xl shadow-md transition-all duration-300"
        >
          <Plus size={18} />
          Add New Kid
        </button>
      </div>

      {/* Kids table with loading state */}
      {loading ? (
        <div className="kids-sec-dashboard bg-white my-6 shadow-xl rounded-xl border border-gray-100 flex items-center justify-center p-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="text-gray-600">Loading kids data...</p>
          </div>
        </div>
      ) : (
        <div className="kids-sec-dashboard bg-white my-6 shadow-xl rounded-xl overflow-hidden border border-gray-100">
          {filteredKids.length > 0 ? (
            <div className="overflow-x-auto">
              <table className='w-full border-collapse'>
                <thead>
                  <tr className='bg-gradient-to-r from-gray-50 to-gray-100'>
                    <th className="px-6 py-4 text-gray-600 font-semibold text-left">Kid's Profile</th>
                    <th className="px-6 py-4 text-gray-600 font-semibold text-center">Badge</th>
                    <th className="px-6 py-4 text-gray-600 font-semibold text-left">Experience Points</th>
                    <th className="px-6 py-4 text-gray-600 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKids.map((kid, index) => {
                    if (!kid) return null; // Skip rendering if kid is null
                    
                    // Calculate badge info with fallbacks
                    const totalXp = Number(kid.total_xp) || 0;
                    const badge = determineBadge(totalXp);
                    const badgeColor = determineBadgeColor(totalXp);
                    
                    return (
                      <tr key={kid.user_id || index} className={`border-t border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className='py-5 px-6'>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-[#0b3d91] to-blue-700 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="infos-kid-container">
                              <p className="font-semibold text-gray-800">{kid.first_name || ''} {kid.last_name || ''}</p>
                              <p className="text-xs text-gray-500">Birth: {formatDate(kid.birth_date)}</p>
                              <p className="text-xs text-gray-400">@{kid.username || kid.email || ''}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className='py-5 px-6'>
                          <div className="flex flex-col items-center justify-center">
                            <span className={`inline-block text-xs px-4 py-1.5 ${badgeColor} text-white rounded-full font-medium`}>
                              {badge}
                            </span>
                          </div>
                        </td>
                        
                        <td className='py-5 px-6'>
                          <div className="flex flex-col">
                            <span className="font-bold text-emerald-500">{totalXp.toLocaleString()} XP</span>
                            <div className="w-full max-w-48 bg-gray-200 rounded-full h-1.5 mt-2">
                              <div 
                                className="bg-emerald-500 h-1.5 rounded-full" 
                                style={{
                                  width: `${Math.min(100, (totalXp / 2000) * 100)}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                              {totalXp >= 2000 ? "Max Level" : `${Math.floor((totalXp / 2000) * 100)}% to Master Explorer`}
                            </span>
                          </div>
                        </td>
                        
                        <td className='py-5 px-6 text-center'>
                          <div className="flex justify-center gap-3">
                            <button 
                              onClick={() => openEditForm(kid)}
                              className="bg-blue-100 text-blue-600 p-2 rounded-xl hover:bg-blue-200 transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => deleteKid(kid.user_id)}
                              className="bg-red-100 text-red-600 p-2 rounded-xl hover:bg-red-200 transition-colors"
                              title="Remove"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <User size={48} className="text-gray-300 mb-3" />
              <h3 className="text-xl font-semibold text-gray-700 mb-1">No Kids Found</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {searchTerm || filterBadge ? 
                  "No kids match your current search filters." : 
                  "You haven't added any kids yet. Add a kid to get started."
                }
              </p>
              {searchTerm || filterBadge ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBadge('');
                  }}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Kid
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add New Kid Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Add New Kid</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700 p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddKid}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                    <input 
                      type="text" 
                      name="first_name"
                      value={kidForm.first_name} 
                      onChange={handleKidFormChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                    <input 
                      type="text"
                      name="last_name" 
                      value={kidForm.last_name} 
                      onChange={handleKidFormChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input 
                    type="email"
                    name="email" 
                    value={kidForm.email} 
                    onChange={handleKidFormChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                  <input 
                    type="password"
                    name="password" 
                    value={kidForm.password} 
                    onChange={handleKidFormChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Create a password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date*</label>
                  <input 
                    type="date"
                    name="birth_date" 
                    value={kidForm.birth_date} 
                    onChange={handleKidFormChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    id="is_restricted"
                    name="is_restricted" 
                    checked={kidForm.is_restricted === 1}
                    onChange={handleKidFormChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                  />
                  <label htmlFor="is_restricted" className="text-sm text-gray-700">
                    Restrict access to assigned courses only
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)} 
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Adding...
                    </>
                  ) : 'Add Kid'}
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                * Required fields
              </p>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Kid Modal */}
      {showEditForm && editingKidForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Kid</h3>
              <button onClick={() => {
                setShowEditForm(false);
                setEditingKidForm(null);
              }} className="text-gray-500 hover:text-gray-700 p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={saveEditChanges}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                    <input 
                      type="text"
                      name="first_name" 
                      value={editingKidForm.first_name} 
                      onChange={handleEditFormChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                    <input 
                      type="text"
                      name="last_name"  
                      value={editingKidForm.last_name} 
                      onChange={handleEditFormChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={editingKidForm.email} 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email address"
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input 
                    type="password"
                    name="password"
                    value={editingKidForm.password} 
                    onChange={handleEditFormChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date*</label>
                  <input 
                    type="date"
                    name="birth_date"
                    value={editingKidForm.birth_date} 
                    onChange={handleEditFormChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    id="edit_is_restricted"
                    name="is_restricted"
                    checked={editingKidForm.is_restricted === 1} 
                    onChange={handleEditFormChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                  />
                  <label htmlFor="edit_is_restricted" className="text-sm text-gray-700">
                    Restrict access to assigned courses only
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingKidForm(null);
                  }} 
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                * Required fields
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}