import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from "../components/ui/Menu";
import LessonsMain from './LessonsMain';

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

        const response = await fetch(`http://localhost:9093/parents/${userData.id}/kids`, {
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
      <LessonsMain kidsData={kidsData} baseUrl="http://localhost:9093" />
    </div>
  );
}
