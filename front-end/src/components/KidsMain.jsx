import React, { useState } from 'react'
import { Search, Lock, Unlock, User, Plus, Trash2, X, Edit } from "lucide-react"

export default function KidsMain() {
  // Initial kids data
  const [kids, setKids] = useState([
    {
      kidId: 1,
      user: {
        userId: 101,
        username: "zakaria_o",
        firstName: "Zakaria",
        lastName: "OUMGHAR",
      },
      parentId: 201,
      birthDate: "2015-06-15",
      totalXp: 32748,
      isRestricted: 1,
      badge: "Astronaut", // Frontend-only field for display
      badgeColor: "bg-black" // Frontend-only field for display
    },
    {
      kidId: 2,
      user: {
        userId: 102,
        username: "hihihow",
        firstName: "hihi",
        lastName: "hay",
      },
      parentId: 201,
      birthDate: "2017-03-22",
      totalXp: 18450,
      isRestricted: 0,
      badge: "Explorer", // Frontend-only field for display
      badgeColor: "bg-green-400" // Frontend-only field for display
    }
  ]);

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for new kid form visibility
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State for edit kid form visibility
  const [showEditForm, setShowEditForm] = useState(false);
  
  // Current parent ID (would normally come from auth context or props)
  const currentParentId = 201;
  
  // State for new kid details
  const [newKid, setNewKid] = useState({
    user: {
      username: '',
      firstName: '',
      lastName: '',
    },
    parentId: currentParentId,
    birthDate: '',
    totalXp: 0,
    isRestricted: 1,
    badge: 'Beginner', // Frontend-only
    badgeColor: 'bg-blue-400' // Frontend-only
  });
  
  // State for editing kid
  const [editingKid, setEditingKid] = useState(null);

  // Function to toggle restriction status
  const toggleRestriction = (kidId) => {
    setKids(kids.map(kid => 
      kid.kidId === kidId ? { ...kid, isRestricted: kid.isRestricted === 1 ? 0 : 1 } : kid
    ));
  };

  // Function to delete a kid
  const deleteKid = (kidId) => {
    setKids(kids.filter(kid => kid.kidId !== kidId));
  };
  
  // Function to open edit form
  const openEditForm = (kid) => {
    setEditingKid({...kid});
    setShowEditForm(true);
  };
  
  // Function to save edit changes
  const saveEditChanges = () => {
    if (!editingKid || !editingKid.user.firstName.trim() || !editingKid.user.lastName.trim()) return;
    
    setKids(kids.map(kid => 
      kid.kidId === editingKid.kidId ? { ...editingKid } : kid
    ));
    
    setShowEditForm(false);
    setEditingKid(null);
  };

  // Function to add a new kid
  const addKid = () => {
    if (!newKid.user.firstName.trim() || !newKid.user.lastName.trim() || !newKid.birthDate) return;
    
    // Generate a username based on first name and last name
    const username = `${newKid.user.firstName.toLowerCase()}_${newKid.user.lastName.substring(0, 1).toLowerCase()}${Math.floor(Math.random() * 100)}`;
    
    setKids([
      ...kids, 
      {
        kidId: kids.length > 0 ? Math.max(...kids.map(k => k.kidId)) + 1 : 1,
        user: {
          ...newKid.user,
          userId: Math.floor(Math.random() * 1000) + 200, // Generate a random user ID for demo
          username: username
        },
        parentId: currentParentId,
        birthDate: newKid.birthDate,
        totalXp: newKid.totalXp,
        isRestricted: newKid.isRestricted,
        badge: newKid.badge,
        badgeColor: newKid.badgeColor
      }
    ]);
    
    // Reset form and hide it
    setNewKid({
      user: {
        username: '',
        firstName: '',
        lastName: '',
      },
      parentId: currentParentId,
      birthDate: '',
      totalXp: 0,
      isRestricted: 1,
      badge: 'Beginner',
      badgeColor: 'bg-blue-400'
    });
    setShowAddForm(false);
  };

  // Filter kids based on search term
  const filteredKids = kids.filter(kid => 
    (kid.user.firstName + ' ' + kid.user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    kid.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kid.badge.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Badge options for the new kid form
  const badgeOptions = [
    { label: 'Beginner', color: 'bg-blue-400' },
    { label: 'Explorer', color: 'bg-green-400' },
    { label: 'Astronaut', color: 'bg-black' },
    { label: 'Scientist', color: 'bg-purple-500' },
    { label: 'Champion', color: 'bg-yellow-500' }
  ];

  return (
    <div className='parents-main bg-gray-50' style={{flexGrow: 1, minHeight: "100vh", padding: "1rem"}}>
      <div className="search-container flex items-center gap-2 bg-white p-3 rounded-lg shadow-md">
        <input 
          type="text" 
          className='search flex-grow px-4 py-2 outline-none' 
          placeholder='Search by name or badge...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-icon text-gray-400 cursor-pointer">
          <Search />
        </button>
      </div>

      <div className="flex justify-between items-center my-4">
        <h2 className="text-xl font-bold text-gray-800">Kids Dashboard</h2>
        <button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
        >
          <Plus size={18} />
          Add New Kid
        </button>
      </div>

      <div className="kids-sec-dashboard bg-white my-3 shadow-xl rounded-lg p-3 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        {filteredKids.length > 0 ? (
          <table className='w-full border-collapse'>
            <thead>
              <tr className='text-left border-b border-gray-200'>
                <th className="p-3">Kid's Name and Date</th>
                <th className="p-3">Badge</th>
                <th className="p-3">Accumulated XP</th>
                <th className="p-3 text-center">Restrictions</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKids.map(kid => (
                <tr key={kid.kidId} className='border-b border-gray-100 hover:bg-gray-50'>
                  <td className='p-3 flex items-center gap-2'>
                    <div className="p-1 bg-[#0b3d91] rounded-full">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="infos-kid-container">
                      <p className="font-semibold">{kid.user.firstName} {kid.user.lastName}</p>
                      <p className="text-xs text-gray-500">Birth: {new Date(kid.birthDate).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400">@{kid.user.username}</p>
                    </div>
                  </td>
                  <td className='p-3'>
                    <span className={`text-xs px-3 py-1 ${kid.badgeColor} text-white rounded-xl`}>
                      {kid.badge}
                    </span>
                  </td>
                  <td className='p-3 font-bold text-[#69ebb7]'>{kid.totalXp} XP</td>
                  <td className='p-3 text-center'>
                    <button onClick={() => toggleRestriction(kid.kidId)} className="transition-all duration-300 hover:scale-110">
                      {kid.isRestricted === 1 ? (
                        <Lock className='text-[#69ebb7]' />
                      ) : (
                        <Unlock className='text-red-600' />
                      )}
                    </button>
                  </td>
                  <td className='p-3 text-center'>
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => openEditForm(kid)}
                        className="text-blue-500 hover:text-blue-700 transition-all duration-300"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteKid(kid.kidId)}
                        className="text-red-500 hover:text-red-700 transition-all duration-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No kids found matching your search.
          </div>
        )}
      </div>

      {/* Add New Kid Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add New Kid</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={newKid.user.firstName} 
                    onChange={(e) => setNewKid({
                      ...newKid, 
                      user: {...newKid.user, firstName: e.target.value}
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={newKid.user.lastName} 
                    onChange={(e) => setNewKid({
                      ...newKid, 
                      user: {...newKid.user, lastName: e.target.value}
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                <input 
                  type="date" 
                  value={newKid.birthDate} 
                  onChange={(e) => setNewKid({...newKid, birthDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                <select 
                  value={newKid.badge} 
                  onChange={(e) => {
                    const selectedBadge = badgeOptions.find(b => b.label === e.target.value);
                    setNewKid({
                      ...newKid, 
                      badge: selectedBadge.label,
                      badgeColor: selectedBadge.color
                    });
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {badgeOptions.map(badge => (
                    <option key={badge.label} value={badge.label}>{badge.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial XP</label>
                <input 
                  type="number" 
                  value={newKid.totalXp} 
                  onChange={(e) => setNewKid({...newKid, totalXp: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="restricted" 
                  checked={newKid.isRestricted === 1} 
                  onChange={(e) => setNewKid({...newKid, isRestricted: e.target.checked ? 1 : 0})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="restricted" className="ml-2 block text-sm text-gray-700">Restricted Access</label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={() => setShowAddForm(false)} 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={addKid} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Kid
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Kid Modal */}
      {showEditForm && editingKid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Kid</h3>
              <button onClick={() => {
                setShowEditForm(false);
                setEditingKid(null);
              }} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={editingKid.user.firstName} 
                    onChange={(e) => setEditingKid({
                      ...editingKid, 
                      user: {...editingKid.user, firstName: e.target.value}
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={editingKid.user.lastName} 
                    onChange={(e) => setEditingKid({
                      ...editingKid, 
                      user: {...editingKid.user, lastName: e.target.value}
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  type="text" 
                  value={editingKid.user.username} 
                  onChange={(e) => setEditingKid({
                    ...editingKid, 
                    user: {...editingKid.user, username: e.target.value}
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                <input 
                  type="date" 
                  value={editingKid.birthDate} 
                  onChange={(e) => setEditingKid({...editingKid, birthDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                <select 
                  value={editingKid.badge} 
                  onChange={(e) => {
                    const selectedBadge = badgeOptions.find(b => b.label === e.target.value);
                    setEditingKid({
                      ...editingKid, 
                      badge: selectedBadge.label,
                      badgeColor: selectedBadge.color
                    });
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {badgeOptions.map(badge => (
                    <option key={badge.label} value={badge.label}>{badge.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">XP</label>
                <input 
                  type="number" 
                  value={editingKid.totalXp} 
                  onChange={(e) => setEditingKid({...editingKid, totalXp: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="edit-restricted" 
                  checked={editingKid.isRestricted === 1} 
                  onChange={(e) => setEditingKid({...editingKid, isRestricted: e.target.checked ? 1 : 0})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="edit-restricted" className="ml-2 block text-sm text-gray-700">Restricted Access</label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={() => {
                  setShowEditForm(false);
                  setEditingKid(null);
                }} 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={saveEditChanges} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}