import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from "../components/ui/Menu";
import LessonsMain from './LessonsMain';

const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:9093' : 'http://http://141.144.226.68:9093'; // Replace with your actual production API URL
};



export default function ParentsDashboardLessons() {
  const [kidsData, setKidsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKids = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
        
        if (!token || !userData.id) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${getApiBaseUrl()}/parents/${userData.id}/kids`, {
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
        setKidsData(kids);
      } catch (err) {
        console.error("Error fetching kids:", err);
      }
    };

    fetchKids();
  }, [navigate]);

  return (
    <div className='dashboard'>
      <Menu />
      <LessonsMain kidsData={kidsData} baseUrl={getApiBaseUrl()} />
    </div>
  );
}
