import React from 'react';
import { Plus, MessageCircle } from 'lucide-react';

const SupportTickets = () => (
  <div className="client-module-view">
    <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h2>Support Center</h2>
        <p>Submit and track your technical support requests.</p>
      </div>
      <button className="new-ticket-btn"><Plus size={18} /> New Request</button>
    </div>
    <div className="ticket-table-card">
      <table className="client-table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Subject</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#TK-9021</td>
            <td>Login issue on production</td>
            <td><span className="priority-high">High</span></td>
            <td><span className="status-pill open">Open</span></td>
            <td><button className="chat-btn"><MessageCircle size={16} /></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default SupportTickets;
