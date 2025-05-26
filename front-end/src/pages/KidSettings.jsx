import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader2, Save } from 'lucide-react';
import KidSidebar from '../components/KidSidebar';
const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:9093' : 'https://http://141.144.226.68/9093'; // Replace with your actual production API URL
};
const KidSettings = ({ baseUrl = getApiBaseUrl() }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [kidData, setKidData] = useState(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
  });

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

  // Fetch kid data
  useEffect(() => {
    const fetchKidData = async () => {
      if (!kidId) {
        navigate('/login');
        return;
      }

      setLoading(true);

      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await fetch(`${baseUrl}/kids/${kidId}/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        setKidData(data);
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          password: '',
          confirm_password: ''
        });
      } catch (err) {
        console.error("Error fetching profile data:", err);
        toast.error(`Failed to load profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchKidData();
  }, [kidId, baseUrl, navigate]);

  // Handle form changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match if both provided
    if (form.password && form.password !== form.confirm_password) {
      toast.error("Passwords don't match");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      // Prepare data for update (only send password if provided)
      const updateData = {
        first_name: form.first_name,
        last_name: form.last_name
      };
      
      if (form.password) {
        updateData.password = form.password;
      }

      const response = await fetch(`${baseUrl}/kids/${kidId}/profile`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      // Reset password fields
      setForm({
        ...form,
        password: '',
        confirm_password: ''
      });

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(`Failed to update profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <KidSidebar baseUrl={baseUrl} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <KidSidebar baseUrl={baseUrl} />
      
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="text-md font-semibold mb-3">Change Password (Optional)</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirm_password"
                          value={form.confirm_password}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={18} className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidSettings;