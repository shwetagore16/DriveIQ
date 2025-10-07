import React from 'react';
import { TrendingDown, TrendingUp, Award, AlertCircle, Lightbulb, Calendar, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import './DriverInsights.css';

const DriverInsights = ({ statistics, riskHistory, darkMode }) => {
  // Calculate trends
  const calculateTrend = () => {
    if (!riskHistory || riskHistory.length < 10) return { direction: 'neutral', value: 0 };
    
    const recent = riskHistory.slice(-10);
    const firstHalf = recent.slice(0, 5).reduce((sum, d) => sum + d.risk_score, 0) / 5;
    const secondHalf = recent.slice(5).reduce((sum, d) => sum + d.risk_score, 0) / 5;
    
    const diff = secondHalf - firstHalf;
    
    if (diff > 5) return { direction: 'improving', value: diff };
    if (diff < -5) return { direction: 'declining', value: Math.abs(diff) };
    return { direction: 'stable', value: 0 };
  };

  const trend = calculateTrend();

  // Radar chart data for driving behavior
  const behaviorData = [
    {
      category: 'Speed Control',
      score: 100 - (statistics?.events_breakdown?.overspeed || 0) * 10,
    },
    {
      category: 'Smooth Braking',
      score: 100 - (statistics?.events_breakdown?.braking || 0) * 10,
    },
    {
      category: 'Gentle Acceleration',
      score: 100 - (statistics?.events_breakdown?.aggressive_accel || 0) * 10,
    },
    {
      category: 'Turn Smoothness',
      score: 100 - (statistics?.events_breakdown?.sharp_turn || 0) * 10,
    },
    {
      category: 'Consistency',
      score: statistics?.average_risk_score || 75,
    },
  ];

  // Safety tips based on statistics
  const generateTips = () => {
    const tips = [];
    
    if ((statistics?.events_breakdown?.overspeed || 0) > 5) {
      tips.push({
        icon: AlertCircle,
        title: 'Reduce Overspeeding',
        description: 'You exceeded speed limits multiple times. Try using cruise control on highways.',
        priority: 'high'
      });
    }
    
    if ((statistics?.events_breakdown?.braking || 0) > 5) {
      tips.push({
        icon: AlertCircle,
        title: 'Improve Braking Habits',
        description: 'Frequent sudden braking detected. Maintain safe following distance and anticipate stops.',
        priority: 'high'
      });
    }
    
    if ((statistics?.events_breakdown?.aggressive_accel || 0) > 3) {
      tips.push({
        icon: Lightbulb,
        title: 'Gentle Acceleration',
        description: 'Aggressive acceleration wastes fuel and increases risk. Accelerate smoothly and gradually.',
        priority: 'medium'
      });
    }
    
    if ((statistics?.events_breakdown?.sharp_turn || 0) > 3) {
      tips.push({
        icon: Lightbulb,
        title: 'Smooth Turning',
        description: 'Sharp turns can be dangerous. Slow down before turns and steer gently.',
        priority: 'medium'
      });
    }
    
    if (tips.length === 0) {
      tips.push({
        icon: Award,
        title: 'Excellent Driving!',
        description: 'Keep up the great work! Your driving behavior is exemplary.',
        priority: 'low'
      });
    }
    
    return tips;
  };

  const safetyTips = generateTips();

  return (
    <div className="driver-insights fade-in">
      {/* Header Section */}
      <div className="insights-header">
        <div className="header-content">
          <Calendar size={32} className="header-icon" />
          <div>
            <h1 className="insights-title">Driver Insights & Analysis</h1>
            <p className="insights-subtitle">Comprehensive report of your driving behavior</p>
          </div>
        </div>
        
        <div className="trend-indicator">
          {trend.direction === 'improving' && (
            <>
              <TrendingUp size={28} style={{ color: '#10B981' }} />
              <div>
                <span className="trend-label" style={{ color: '#10B981' }}>Improving</span>
                <span className="trend-value">+{trend.value.toFixed(1)}%</span>
              </div>
            </>
          )}
          {trend.direction === 'declining' && (
            <>
              <TrendingDown size={28} style={{ color: '#FF4C4C' }} />
              <div>
                <span className="trend-label" style={{ color: '#FF4C4C' }}>Declining</span>
                <span className="trend-value">-{trend.value.toFixed(1)}%</span>
              </div>
            </>
          )}
          {trend.direction === 'stable' && (
            <>
              <Target size={28} style={{ color: '#F59E0B' }} />
              <div>
                <span className="trend-label" style={{ color: '#F59E0B' }}>Stable</span>
                <span className="trend-value">~{trend.value.toFixed(1)}%</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card summary-card">
          <div className="summary-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
            <Award style={{ color: '#10B981' }} size={32} />
          </div>
          <div className="summary-content">
            <h3>Average Risk Score</h3>
            <div className="summary-value">{statistics?.average_risk_score?.toFixed(1) || 'N/A'}</div>
            <p className="summary-description">Last 24 hours</p>
          </div>
        </div>

        <div className="card summary-card">
          <div className="summary-icon" style={{ background: 'rgba(0, 191, 166, 0.15)' }}>
            <TrendingUp style={{ color: '#00BFA6' }} size={32} />
          </div>
          <div className="summary-content">
            <h3>Total Distance</h3>
            <div className="summary-value">~{((statistics?.total_data_points || 0) * 0.5).toFixed(1)} km</div>
            <p className="summary-description">Estimated based on data points</p>
          </div>
        </div>

        <div className="card summary-card">
          <div className="summary-icon" style={{ background: 'rgba(255, 76, 76, 0.15)' }}>
            <AlertCircle style={{ color: '#FF4C4C' }} size={32} />
          </div>
          <div className="summary-content">
            <h3>Total Risk Events</h3>
            <div className="summary-value">{statistics?.total_events || 0}</div>
            <p className="summary-description">Last 24 hours</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="insights-charts">
        {/* Risk Score Trend */}
        <div className="card chart-card-large">
          <div className="card-header">
            <TrendingUp className="card-icon" size={24} />
            <h2 className="card-title">Risk Score Trend Analysis</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={riskHistory}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BFA6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00BFA6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#E5E7EB'} />
              <XAxis 
                dataKey="timestamp" 
                stroke={darkMode ? '#94A3B8' : '#64748B'}
                style={{ fontSize: '0.85rem' }}
              />
              <YAxis 
                domain={[0, 100]}
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
              <Area 
                type="monotone" 
                dataKey="risk_score" 
                stroke="#00BFA6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRisk)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Behavior Radar Chart */}
        <div className="card chart-card-radar">
          <div className="card-header">
            <Target className="card-icon" size={24} />
            <h2 className="card-title">Driving Behavior Analysis</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={behaviorData}>
              <PolarGrid stroke={darkMode ? '#334155' : '#E5E7EB'} />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fill: darkMode ? '#94A3B8' : '#64748B', fontSize: '0.85rem' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fill: darkMode ? '#94A3B8' : '#64748B', fontSize: '0.75rem' }}
              />
              <Radar 
                name="Score" 
                dataKey="score" 
                stroke="#1A1F71" 
                fill="#00BFA6" 
                fillOpacity={0.6} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Safety Tips Section */}
      <div className="card tips-card">
        <div className="card-header">
          <Lightbulb className="card-icon" size={24} />
          <h2 className="card-title">Personalized Safety Tips</h2>
        </div>
        
        <div className="tips-grid">
          {safetyTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className={`tip-item priority-${tip.priority}`}>
                <div className="tip-icon">
                  <Icon size={24} />
                </div>
                <div className="tip-content">
                  <h4 className="tip-title">{tip.title}</h4>
                  <p className="tip-description">{tip.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risky Events Highlight */}
      <div className="card risky-events-card">
        <div className="card-header">
          <AlertCircle className="card-icon" size={24} />
          <h2 className="card-title">Risk Events Summary</h2>
        </div>
        
        <div className="risky-events-grid">
          <div className="risky-event-item">
            <div className="event-metric-value" style={{ color: '#FF4C4C' }}>
              {statistics?.events_breakdown?.overspeed || 0}
            </div>
            <div className="event-metric-label">Overspeeding Incidents</div>
            <div className="event-progress-bar">
              <div 
                className="event-progress-fill" 
                style={{ 
                  width: `${Math.min((statistics?.events_breakdown?.overspeed || 0) * 10, 100)}%`,
                  background: '#FF4C4C'
                }}
              ></div>
            </div>
          </div>

          <div className="risky-event-item">
            <div className="event-metric-value" style={{ color: '#F59E0B' }}>
              {statistics?.events_breakdown?.braking || 0}
            </div>
            <div className="event-metric-label">Sudden Braking</div>
            <div className="event-progress-bar">
              <div 
                className="event-progress-fill" 
                style={{ 
                  width: `${Math.min((statistics?.events_breakdown?.braking || 0) * 10, 100)}%`,
                  background: '#F59E0B'
                }}
              ></div>
            </div>
          </div>

          <div className="risky-event-item">
            <div className="event-metric-value" style={{ color: '#8B5CF6' }}>
              {statistics?.events_breakdown?.aggressive_accel || 0}
            </div>
            <div className="event-metric-label">Aggressive Acceleration</div>
            <div className="event-progress-bar">
              <div 
                className="event-progress-fill" 
                style={{ 
                  width: `${Math.min((statistics?.events_breakdown?.aggressive_accel || 0) * 10, 100)}%`,
                  background: '#8B5CF6'
                }}
              ></div>
            </div>
          </div>

          <div className="risky-event-item">
            <div className="event-metric-value" style={{ color: '#06B6D4' }}>
              {statistics?.events_breakdown?.sharp_turn || 0}
            </div>
            <div className="event-metric-label">Sharp Turns</div>
            <div className="event-progress-bar">
              <div 
                className="event-progress-fill" 
                style={{ 
                  width: `${Math.min((statistics?.events_breakdown?.sharp_turn || 0) * 10, 100)}%`,
                  background: '#06B6D4'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverInsights;
