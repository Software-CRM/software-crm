import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Zap, Target, Users, TrendingUp } from 'lucide-react';
import './ProjectAnalytics.css';

const ProjectAnalytics = () => {
  const sprintData = [
    { day: 'Day 1', ideal: 100, actual: 100 },
    { day: 'Day 2', ideal: 80, actual: 85 },
    { day: 'Day 3', ideal: 60, actual: 70 },
    { day: 'Day 4', ideal: 40, actual: 45 },
    { day: 'Day 5', ideal: 20, actual: 15 },
    { day: 'Day 6', ideal: 0, actual: 0 }
  ];

  const distributionData = [
    { name: 'Completed', value: 45, color: '#10b981' },
    { name: 'In Progress', value: 30, color: '#3b82f6' },
    { name: 'Todo', value: 15, color: '#e2e8f0' },
    { name: 'Bugs', value: 10, color: '#ef4444' }
  ];

  const weeklyPerformance = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 7 },
    { name: 'Wed', tasks: 5 },
    { name: 'Thu', tasks: 9 },
    { name: 'Fri', tasks: 6 }
  ];

  return (
    <div className="analytics-dashboard">
      <div className="analytics-stats-row">
        <div className="analytic-card">
          <div className="a-icon blue"><Target size={24} /></div>
          <div className="a-data">
            <span className="a-label">Sprint Progress</span>
            <span className="a-value">72%</span>
          </div>
        </div>
        <div className="analytic-card">
          <div className="a-icon green"><Zap size={24} /></div>
          <div className="a-data">
            <span className="a-label">Team Velocity</span>
            <span className="a-value">34 pts</span>
          </div>
        </div>
        <div className="analytic-card">
          <div className="a-icon orange"><Users size={24} /></div>
          <div className="a-data">
            <span className="a-label">Active Members</span>
            <span className="a-value">12</span>
          </div>
        </div>
        <div className="analytic-card">
          <div className="a-icon purple"><TrendingUp size={24} /></div>
          <div className="a-data">
            <span className="a-label">Efficiency Score</span>
            <span className="a-value">94/100</span>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card large">
          <h3>Sprint Burn-down Chart</h3>
          <p className="subtitle">Ideal vs Actual remaining work (Story Points)</p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sprintData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="ideal" stroke="#e2e8f0" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Task Distribution</h3>
          <div className="chart-wrapper flex-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {distributionData.map(item => (
                <div key={item.name} className="legend-item">
                  <span className="dot" style={{backgroundColor: item.color}}></span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Weekly Team Velocity</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyPerformance}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="tasks" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
