import React from 'react';
import { Zap, CheckCircle2, Clock } from 'lucide-react';

const Productivity = () => (
  <div className="performance-workspace">
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-icon blue"><Zap size={24} /></div>
        <div className="stat-info">
          <span className="stat-label">Efficiency</span>
          <span className="stat-value">94%</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon green"><CheckCircle2 size={24} /></div>
        <div className="stat-info">
          <span className="stat-label">Tasks Done</span>
          <span className="stat-value">128</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon orange"><Clock size={24} /></div>
        <div className="stat-info">
          <span className="stat-label">Avg. Response</span>
          <span className="stat-value">2.4h</span>
        </div>
      </div>
    </div>
    <div className="performance-chart-card">
      <h3>Monthly Growth</h3>
      <div className="placeholder-chart">
        <div className="chart-bar" style={{height: '60%'}}></div>
        <div className="chart-bar" style={{height: '80%'}}></div>
        <div className="chart-bar" style={{height: '70%'}}></div>
        <div className="chart-bar" style={{height: '95%'}}></div>
        <div className="chart-bar" style={{height: '85%'}}></div>
      </div>
    </div>
  </div>
);

export default Productivity;
