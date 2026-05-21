import React from 'react';

const TeamAttendance = () => (
  <div className="manager-tab-content">
    <div className="tab-header">
      <h1>Team Attendance</h1>
      <p>Monitor punch-in/out times and daily work hours.</p>
    </div>
    <div className="attendance-table-container">
      <table className="manager-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Punch In</th>
            <th>Punch Out</th>
            <th>Total Hours</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: 'Sarah Jenkins', in: '09:00 AM', out: '-', hours: '6.5h', status: 'Working' },
            { name: 'Mike Ross', in: '08:45 AM', out: '05:45 PM', hours: '9h', status: 'Completed' }
          ].map((row, i) => (
            <tr key={i}>
              <td>{row.name}</td>
              <td>{row.in}</td>
              <td>{row.out}</td>
              <td>{row.hours}</td>
              <td><span className="status-pill">{row.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TeamAttendance;
