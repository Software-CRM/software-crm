import React from 'react';
import { 
  Activity, 
  Terminal, 
  Monitor, 
  User as UserIcon, 
  Clock, 
  Search,
  Download,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

const logs = [
  { user: 'Admin User', action: 'Modified system settings', timestamp: '2026-05-06 10:45 AM', ip: '192.168.1.1', device: 'macOS / Chrome' },
  { user: 'John Doe', action: 'Generated quarterly report', timestamp: '2026-05-06 10:12 AM', ip: '192.168.1.45', device: 'Windows / Edge' },
  { user: 'System', action: 'Automated backup completed', timestamp: '2026-05-06 09:00 AM', ip: 'internal', device: 'Cloud Server' },
  { user: 'Jane Smith', action: 'Created new client profile: "TechFlow"', timestamp: '2026-05-06 08:34 AM', ip: '10.0.0.12', device: 'iOS / Safari' },
  { user: 'Admin User', action: 'User "Jane Smith" role changed to EMPLOYEE', timestamp: '2026-05-05 06:15 PM', ip: '192.168.1.1', device: 'macOS / Chrome' },
  { user: 'Alex Rivera', action: 'Failed login attempt', timestamp: '2026-05-05 05:42 PM', ip: '45.12.33.102', device: 'Android / Chrome' },
];

const LogsTab = () => {
  return (
    <div className="tab-content logs-tab">
      <div className="tab-header-actions">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Filter logs by user or action..." />
        </div>
        <div className="action-buttons-group">
          <button className="secondary-btn">
            <Filter size={18} />
            <span>Advanced Filters</span>
          </button>
          <button className="secondary-btn">
            <Download size={18} />
            <span>Export Logs</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="modern-table logs-table">
          <thead>
            <tr>
              <th>USER</th>
              <th>ACTION</th>
              <th>TIMESTAMP</th>
              <th>IP ADDRESS</th>
              <th>DEVICE</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx}>
                <td>
                  <div className="log-user">
                    <UserIcon size={14} className="muted-icon" />
                    <span>{log.user}</span>
                  </div>
                </td>
                <td>
                  <div className="log-action">
                    <Terminal size={14} className="action-icon" />
                    <span>{log.action}</span>
                  </div>
                </td>
                <td>
                  <div className="log-time">
                    <Clock size={14} className="muted-icon" />
                    <span>{log.timestamp}</span>
                  </div>
                </td>
                <td className="font-mono text-sm">{log.ip}</td>
                <td>
                  <div className="log-device">
                    <Monitor size={14} className="muted-icon" />
                    <span>{log.device}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="logs-timeline-view">
        <div className="section-header">
          <h3>Real-time Activity Stream</h3>
          <div className="live-badge">
            <span className="pulse-dot"></span>
            LIVE
          </div>
        </div>
        <div className="timeline-container">
          {logs.slice(0, 4).map((log, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <span className="time">{log.timestamp.split(' ')[1]} {log.timestamp.split(' ')[2]}</span>
                <p><strong>{log.user}</strong> {log.action.toLowerCase()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogsTab;
