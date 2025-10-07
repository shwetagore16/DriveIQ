import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import DriverInsights from './components/DriverInsights';
import AdminPanel from './components/AdminPanel';
import './App.css';
import { Moon, Sun, Activity } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [riskHistory, setRiskHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch live data every 2 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, statsRes, historyRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/latest`),
          axios.get(`${BACKEND_URL}/api/statistics`),
          axios.get(`${BACKEND_URL}/api/risk-history?hours=24`)
        ]);

        setLiveData(latestRes.data.data);
        setStatistics(statsRes.data.statistics);
        setRiskHistory(historyRes.data.history);
        setIsConnected(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsConnected(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <Activity className="logo-icon" size={32} />
          <h1 className="app-title">DriveIQ</h1>
          <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
        
        <nav className="nav-menu">
          <button
            className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-button ${currentPage === 'insights' ? 'active' : ''}`}
            onClick={() => setCurrentPage('insights')}
          >
            Driver Insights
          </button>
          <button
            className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentPage('admin')}
          >
            Admin Panel
          </button>
        </nav>

        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Main Content */}
      <main className="app-content">
        {currentPage === 'dashboard' && (
          <Dashboard 
            liveData={liveData} 
            statistics={statistics} 
            riskHistory={riskHistory}
            darkMode={darkMode}
          />
        )}
        {currentPage === 'insights' && (
          <DriverInsights 
            statistics={statistics} 
            riskHistory={riskHistory}
            darkMode={darkMode}
          />
        )}
        {currentPage === 'admin' && (
          <AdminPanel 
            statistics={statistics}
            darkMode={darkMode}
          />
        )}
      </main>
    </div>
  );
}

export default App;
