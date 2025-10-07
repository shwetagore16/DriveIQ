import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Gauge, AlertTriangle, TrendingUp, Zap, MapPin, Activity } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ liveData, statistics, riskHistory, darkMode }) => {
  // Determine risk score color
  const getRiskColor = (score) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#FF4C4C'; // Red
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const riskScore = liveData?.risk_score || 0;
  const riskLevel = liveData?.risk_level || 'Unknown';
  const riskColor = getRiskColor(riskScore);

  return (
    <div className="dashboard fade-in">
      {/* Top Section: Risk Score + Key Metrics */}
      <div className="dashboard-grid-top">
        {/* Main Risk Score Gauge */}
        <div className="card risk-score-card">
          <div className="card-header">
            <Gauge className="card-icon" size={24} />
            <h2 className="card-title">Driver Risk Score</h2>
          </div>
          
          <div className="risk-score-container">
            <div className="circular-gauge">
              <CircularProgressbar
                value={riskScore}
                text={`${Math.round(riskScore)}`}
                styles={buildStyles({
                  textSize: '1.8rem',
                  pathColor: riskColor,
                  textColor: riskColor,
                  trailColor: darkMode ? '#334155' : '#E5E7EB',
                  pathTransitionDuration: 0.5,
                })}
              />
            </div>
            
            <div className="risk-info">
              <span className={`badge badge-${riskLevel.toLowerCase()}`}>
                {riskLevel} Risk
              </span>
              <p className="risk-description">
                {riskScore >= 80 && '✓ Excellent driving behavior. Keep it up!'}
                {riskScore >= 60 && riskScore < 80 && '⚠️ Moderate risk detected. Drive carefully.'}
                {riskScore < 60 && '⛔ High risk! Please drive more safely.'}
              </p>
              <p className="last-update">
                Last Update: {formatTime(liveData?.server_timestamp)}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="metrics-grid">
          <div className="card metric-card">
            <div className="metric-icon-wrapper" style={{ background: 'rgba(0, 191, 166, 0.15)' }}>
              <Activity style={{ color: '#00BFA6' }} size={28} />
            </div>
            <div className="metric-value">{liveData?.speed?.toFixed(1) || '0.0'}</div>
            <div className="metric-label">Speed (km/h)</div>
            {liveData?.overspeed === 1 && (
              <span className="metric-alert">⚠️ Overspeeding!</span>
            )}
          </div>

          <div className="card metric-card">
            <div className="metric-icon-wrapper" style={{ background: 'rgba(26, 31, 113, 0.15)' }}>
              <Zap style={{ color: '#1A1F71' }} size={28} />
            </div>
            <div className="metric-value">{liveData?.rpm || '0'}</div>
            <div className="metric-label">Engine RPM</div>
          </div>

          <div className="card metric-card">
            <div className="metric-icon-wrapper" style={{ background: 'rgba(255, 76, 76, 0.15)' }}>
              <AlertTriangle style={{ color: '#FF4C4C' }} size={28} />
            </div>
            <div className="metric-value">{statistics?.total_events || '0'}</div>
            <div className="metric-label">Risk Events (24h)</div>
          </div>

          <div className="card metric-card">
            <div className="metric-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
              <TrendingUp style={{ color: '#F59E0B' }} size={28} />
            </div>
            <div className="metric-value">{statistics?.average_speed?.toFixed(1) || '0.0'}</div>
            <div className="metric-label">Avg Speed (24h)</div>
          </div>
        </div>
      </div>

      {/* Middle Section: Charts */}
      <div className="dashboard-grid-middle">
        {/* Speed vs Time Chart */}
        <div className="card chart-card">
          <div className="card-header">
            <Activity className="card-icon" size={24} />
            <h2 className="card-title">Speed Over Time</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#E5E7EB'} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                stroke={darkMode ? '#94A3B8' : '#64748B'}
                style={{ fontSize: '0.85rem' }}
              />
              <YAxis 
                stroke={darkMode ? '#94A3B8' : '#64748B'}
                style={{ fontSize: '0.85rem' }}
              />
              <Tooltip 
                contentStyle={{
                  background: darkMode ? '#1E293B' : '#FFF',
                  border: `1px solid ${darkMode ? '#334155' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="speed" 
                stroke="#00BFA6" 
                strokeWidth={3}
                dot={{ fill: '#00BFA6', r: 4 }}
                name="Speed (km/h)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Score History Chart */}
        <div className="card chart-card">
          <div className="card-header">
            <Gauge className="card-icon" size={24} />
            <h2 className="card-title">Risk Score History</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#E5E7EB'} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                stroke={darkMode ? '#94A3B8' : '#64748B'}
                style={{ fontSize: '0.85rem' }}
              />
              <YAxis 
                stroke={darkMode ? '#94A3B8' : '#64748B'}
                style={{ fontSize: '0.85rem' }}
              />
              <Tooltip 
                contentStyle={{
                  background: darkMode ? '#1E293B' : '#FFF',
                  border: `1px solid ${darkMode ? '#334155' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="risk_score" 
                fill="#1A1F71" 
                radius={[8, 8, 0, 0]}
                name="Risk Score"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section: Events & GPS */}
      <div className="dashboard-grid-bottom">
        {/* Event Breakdown */}
        <div className="card events-card">
          <div className="card-header">
            <AlertTriangle className="card-icon" size={24} />
            <h2 className="card-title">Risk Events Breakdown</h2>
          </div>
          
          <div className="events-list">
            <div className="event-item">
              <div className="event-label">
                <span className="event-dot" style={{ background: '#FF4C4C' }}></span>
                Overspeeding
              </div>
              <div className="event-count">{statistics?.events_breakdown?.overspeed || 0}</div>
            </div>
            
            <div className="event-item">
              <div className="event-label">
                <span className="event-dot" style={{ background: '#F59E0B' }}></span>
                Sudden Braking
              </div>
              <div className="event-count">{statistics?.events_breakdown?.braking || 0}</div>
            </div>
            
            <div className="event-item">
              <div className="event-label">
                <span className="event-dot" style={{ background: '#8B5CF6' }}></span>
                Aggressive Acceleration
              </div>
              <div className="event-count">{statistics?.events_breakdown?.aggressive_accel || 0}</div>
            </div>
            
            <div className="event-item">
              <div className="event-label">
                <span className="event-dot" style={{ background: '#06B6D4' }}></span>
                Sharp Turns
              </div>
              <div className="event-count">{statistics?.events_breakdown?.sharp_turn || 0}</div>
            </div>
          </div>
        </div>

        {/* GPS Location */}
        <div className="card gps-card">
          <div className="card-header">
            <MapPin className="card-icon" size={24} />
            <h2 className="card-title">Current Location</h2>
          </div>
          
          <div className="gps-info">
            <div className="gps-coords">
              <div className="coord-item">
                <span className="coord-label">Latitude:</span>
                <span className="coord-value">{liveData?.latitude?.toFixed(6) || 'N/A'}</span>
              </div>
              <div className="coord-item">
                <span className="coord-label">Longitude:</span>
                <span className="coord-value">{liveData?.longitude?.toFixed(6) || 'N/A'}</span>
              </div>
            </div>
            
            <div className="map-placeholder">
              <MapPin size={48} style={{ color: '#00BFA6', opacity: 0.5 }} />
              <p>GPS Route Simulation Active</p>
              <small>Bangalore Region</small>
            </div>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="card status-card">
          <div className="card-header">
            <Activity className="card-icon" size={24} />
            <h2 className="card-title">Live Status</h2>
          </div>
          
          <div className="status-indicators">
            <div className={`status-indicator ${liveData?.overspeed ? 'active-alert' : ''}`}>
              <div className="status-dot"></div>
              <span>Overspeed</span>
            </div>
            
            <div className={`status-indicator ${liveData?.braking ? 'active-alert' : ''}`}>
              <div className="status-dot"></div>
              <span>Hard Braking</span>
            </div>
            
            <div className={`status-indicator ${liveData?.aggressive_accel ? 'active-alert' : ''}`}>
              <div className="status-dot"></div>
              <span>Aggressive Accel</span>
            </div>
            
            <div className={`status-indicator ${liveData?.sharp_turn ? 'active-alert' : ''}`}>
              <div className="status-dot"></div>
              <span>Sharp Turn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
