import React, { useState } from 'react';
import { Shield, Users, Trophy, Filter, Search, Award } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = ({ statistics, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');

  // Mock driver data (in production, this would come from the backend)
  const mockDrivers = [
    {
      id: 'ESP8266_001',
      name: 'Driver 1',
      vehicle: 'Toyota Camry',
      riskScore: statistics?.average_risk_score || 85,
      totalTrips: 45,
      totalEvents: statistics?.total_events || 3,
      avgSpeed: statistics?.average_speed || 65,
      lastActive: '2 mins ago'
    },
    {
      id: 'ESP8266_002',
      name: 'Driver 2',
      vehicle: 'Honda Accord',
      riskScore: 72,
      totalTrips: 38,
      totalEvents: 8,
      avgSpeed: 72,
      lastActive: '15 mins ago'
    },
    {
      id: 'ESP8266_003',
      name: 'Driver 3',
      vehicle: 'Tesla Model 3',
      riskScore: 92,
      totalTrips: 52,
      totalEvents: 1,
      avgSpeed: 58,
      lastActive: '1 hour ago'
    },
    {
      id: 'ESP8266_004',
      name: 'Driver 4',
      vehicle: 'BMW X5',
      riskScore: 55,
      totalTrips: 29,
      totalEvents: 15,
      avgSpeed: 88,
      lastActive: '3 hours ago'
    },
    {
      id: 'ESP8266_005',
      name: 'Driver 5',
      vehicle: 'Audi A4',
      riskScore: 78,
      totalTrips: 41,
      totalEvents: 6,
      avgSpeed: 68,
      lastActive: '5 hours ago'
    },
  ];

  // Determine risk level
  const getRiskLevel = (score) => {
    if (score >= 80) return 'Low';
    if (score >= 60) return 'Medium';
    return 'High';
  };

  // Filter drivers
  const filteredDrivers = mockDrivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const riskLevel = getRiskLevel(driver.riskScore);
    const matchesFilter = filterRisk === 'all' || riskLevel.toLowerCase() === filterRisk;
    
    return matchesSearch && matchesFilter;
  });

  // Sort drivers by risk score (leaderboard)
  const leaderboard = [...mockDrivers].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="admin-panel fade-in">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <Shield size={32} className="header-icon" />
          <div>
            <h1 className="admin-title">Admin Control Panel</h1>
            <p className="admin-subtitle">Monitor and manage all drivers</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="admin-stats">
        <div className="card stat-card">
          <Users className="stat-icon" style={{ color: '#00BFA6' }} size={32} />
          <div className="stat-content">
            <div className="stat-value">{mockDrivers.length}</div>
            <div className="stat-label">Total Drivers</div>
          </div>
        </div>

        <div className="card stat-card">
          <Trophy className="stat-icon" style={{ color: '#10B981' }} size={32} />
          <div className="stat-content">
            <div className="stat-value">{leaderboard.filter(d => getRiskLevel(d.riskScore) === 'Low').length}</div>
            <div className="stat-label">Safe Drivers</div>
          </div>
        </div>

        <div className="card stat-card">
          <Award className="stat-icon" style={{ color: '#F59E0B' }} size={32} />
          <div className="stat-content">
            <div className="stat-value">{leaderboard.filter(d => getRiskLevel(d.riskScore) === 'Medium').length}</div>
            <div className="stat-label">Medium Risk</div>
          </div>
        </div>

        <div className="card stat-card">
          <Shield className="stat-icon" style={{ color: '#FF4C4C' }} size={32} />
          <div className="stat-content">
            <div className="stat-value">{leaderboard.filter(d => getRiskLevel(d.riskScore) === 'High').length}</div>
            <div className="stat-label">High Risk</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="admin-content-grid">
        {/* Drivers Table */}
        <div className="card drivers-table-card">
          <div className="card-header">
            <Users className="card-icon" size={24} />
            <h2 className="card-title">All Drivers</h2>
          </div>

          {/* Search and Filter */}
          <div className="table-controls">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name, vehicle, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-buttons">
              <Filter size={18} />
              <button
                className={`filter-btn ${filterRisk === 'all' ? 'active' : ''}`}
                onClick={() => setFilterRisk('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${filterRisk === 'low' ? 'active' : ''}`}
                onClick={() => setFilterRisk('low')}
              >
                Low Risk
              </button>
              <button
                className={`filter-btn ${filterRisk === 'medium' ? 'active' : ''}`}
                onClick={() => setFilterRisk('medium')}
              >
                Medium Risk
              </button>
              <button
                className={`filter-btn ${filterRisk === 'high' ? 'active' : ''}`}
                onClick={() => setFilterRisk('high')}
              >
                High Risk
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="drivers-table-wrapper">
            <table className="drivers-table">
              <thead>
                <tr>
                  <th>Driver ID</th>
                  <th>Name</th>
                  <th>Vehicle</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                  <th>Total Trips</th>
                  <th>Events</th>
                  <th>Avg Speed</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map(driver => {
                  const riskLevel = getRiskLevel(driver.riskScore);
                  return (
                    <tr key={driver.id}>
                      <td className="driver-id">{driver.id}</td>
                      <td className="driver-name">{driver.name}</td>
                      <td>{driver.vehicle}</td>
                      <td>
                        <span className={`score-badge risk-${riskLevel.toLowerCase()}`}>
                          {driver.riskScore}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${riskLevel.toLowerCase()}`}>
                          {riskLevel}
                        </span>
                      </td>
                      <td>{driver.totalTrips}</td>
                      <td>
                        <span className={driver.totalEvents > 10 ? 'events-high' : ''}>
                          {driver.totalEvents}
                        </span>
                      </td>
                      <td>{driver.avgSpeed} km/h</td>
                      <td className="last-active">{driver.lastActive}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="card leaderboard-card">
          <div className="card-header">
            <Trophy className="card-icon" size={24} />
            <h2 className="card-title">Safest Drivers Leaderboard</h2>
          </div>

          <div className="leaderboard">
            {leaderboard.map((driver, index) => (
              <div key={driver.id} className="leaderboard-item">
                <div className="rank-badge">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </div>
                
                <div className="driver-info">
                  <div className="driver-name-lead">{driver.name}</div>
                  <div className="driver-vehicle">{driver.vehicle}</div>
                </div>

                <div className="score-display">
                  <div className={`score-value risk-${getRiskLevel(driver.riskScore).toLowerCase()}`}>
                    {driver.riskScore}
                  </div>
                  <div className="score-label">Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
