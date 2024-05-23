import React, { useEffect, useState } from 'react';
import './StatPanel.css'

function StatPanel() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getStats = async () => {
      const response = await fetch('http://localhost:8000/api/stats', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Error fetching stats');
      }
    };

    getStats();
  }, []);

  if (!stats) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>File Statistics</h2>
      <p>Total size: {stats.size / 1000} ko</p>
      <p>Total documents: {stats.doc}</p>
      <p>Total images: {stats.image}</p>
      <p>Total PDFs: {stats.pdf}</p>
      <p>Total others: {stats.other}</p>
    </div>
  );
}

export default StatPanel;
