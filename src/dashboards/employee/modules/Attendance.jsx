import React from 'react';
import { MapPin } from 'lucide-react';

const Attendance = ({ isPunchedIn, setIsPunchedIn }) => (
  <div className="attendance-workspace">
    <div className="punch-panel">
      <div className="time-display">11:45:32 AM</div>
      <p className="location-info"><MapPin size={14} /> Madhapur, Hyderabad, India</p>
      
      <button 
        className={`punch-btn ${isPunchedIn ? 'out' : 'in'}`}
        onClick={() => setIsPunchedIn(!isPunchedIn)}
      >
        {isPunchedIn ? 'Punch Out' : 'Punch In'}
      </button>
      
      <div className="punch-stats">
        <div className="ps-box"><span>09:00 AM</span><p>First In</p></div>
        <div className="ps-box"><span>02:45 H</span><p>Work Time</p></div>
      </div>
    </div>

    <div className="attendance-history-card">
      <h3>Recent History</h3>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>In</th>
            <th>Out</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>May 06</td>
            <td>09:02 AM</td>
            <td>06:15 PM</td>
            <td>9.2h</td>
          </tr>
          <tr>
            <td>May 05</td>
            <td>08:55 AM</td>
            <td>05:45 PM</td>
            <td>8.8h</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default Attendance;
