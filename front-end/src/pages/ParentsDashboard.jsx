import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Menu from "../components/ui/Menu";
import ParentsMain from "../components/ParentsMain";
import ParentsSide from "../components/ParentsSide";
import "../css/dashboard.css";

// Define the base URL as a constant
const BASE_URL = "http://localhost:9093";

export default function ParentsDashboard() {
  const [parentData, setParentData] = useState(null);
  const [kidsData, setKidsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from storage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
    
    if (!token) {
      navigate("/login");
      return;
    }

    // Create headers with authentication
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    // Use user data from localStorage if available
    if (userData && userData.id) {
      // Map the user data to parentData format
      const mappedParentData = {
        user_id: userData.id,
        first_name: userData.firstName || "",
        last_name: userData.lastName || "",
        email: userData.email || "",
        role: userData.role || "parent"
      };

      setParentData(mappedParentData);
      
      // Only fetch kids data
      fetchKidsData(token, userData.id, headers);
    } else {
      // If no user data in localStorage, fetch both profile and kids
      fetchParentData(token, headers);
    }
  }, [navigate]);

  const fetchKidsData = async (token, parentId, headers) => {
    try {
      // Fetch parent's kids
      const kidsResponse = await fetch(`${BASE_URL}/parents/${parentId}/kids`, {
        headers
      });

      if (!kidsResponse.ok) {
        throw new Error(`Failed to fetch kids: ${kidsResponse.status}`);
      }

      const kidsData = await kidsResponse.json();
      setKidsData(kidsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching kids data:", err);
      setError(err.message);
      toast.error(`Failed to load kids data: ${err.message}`);
      setLoading(false);
    }
  };

  const fetchParentData = async (token, headers) => {
    setLoading(true);
    try {
      // Fetch parent profile data
      const profileResponse = await fetch(`${BASE_URL}/users/me`, {
        headers
      });

      if (!profileResponse.ok) {
        if (profileResponse.status === 401 || profileResponse.status === 403) {
          // Token expired or invalid
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
          navigate("/login");
          return;
        }
        throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
      }

      const profileData = await profileResponse.json();
      setParentData(profileData);

      // Now fetch kids data
      await fetchKidsData(token, profileData.user_id, headers);

    } catch (err) {
      console.error("Error fetching parent data:", err);
      setError(err.message);
      toast.error(`Failed to load data: ${err.message}`);
      setLoading(false);
    }
  };

  // Handler for toggling kid restriction status
  const handleToggleRestriction = async (kidUserId, currentStatus) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const parentId = parentData.user_id;
      
      const response = await fetch(
        `${BASE_URL}/parents/${parentId}/kids/${kidUserId}/toggle-restriction`, 
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ is_restricted: currentStatus === 1 ? 0 : 1 })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update restriction status: ${response.status}`);
      }

      // Update local state to reflect the change
      setKidsData(kidsData.map(kid => 
        kid.user_id === kidUserId 
          ? { ...kid, is_restricted: kid.is_restricted === 1 ? 0 : 1 } 
          : kid
      ));
      
      toast.success(`Successfully updated restriction for ${kidsData.find(k => k.user_id === kidUserId)?.first_name}`);
      
    } catch (err) {
      console.error("Error updating kid restriction:", err);
      toast.error(`Failed to update restriction: ${err.message}`);
    }
  };

  // Handler for creating a new kid
  const handleCreateKid = async (kidData) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const parentId = parentData.user_id;
      
      const response = await fetch(
        `${BASE_URL}/parents/${parentId}/kids`, 
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(kidData)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create kid: ${response.status}`);
      }

      const newKid = await response.json();
      
      // Add new kid to the local state
      setKidsData([...kidsData, newKid]);
      
      toast.success(`Successfully created profile for ${newKid.first_name}`);
      return newKid;
      
    } catch (err) {
      console.error("Error creating kid:", err);
      toast.error(`Failed to create kid: ${err.message}`);
      throw err;
    }
  };

  // Rest of component unchanged
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600">Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <Menu />
      <ParentsMain 
        parentData={parentData}
        kidsData={kidsData}
        onToggleRestriction={handleToggleRestriction}
        baseUrl={BASE_URL}
      />
      <ParentsSide 
        parentData={parentData}
        onCreateKid={handleCreateKid}
      />
    </div>
  );
}