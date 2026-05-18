import React from 'react';
import { Send } from 'lucide-react';

const WorkReports = () => (
  <div className="reports-workspace">
    <div className="report-form-card">
      <h3>Submit Daily Work Report</h3>
      <p className="card-subtitle">Summarize your achievements and blockers for today.</p>
      
      <div className="form-group">
        <label>Work Summary</label>
        <textarea placeholder="What did you work on today?"></textarea>
      </div>
      
      <div className="form-group">
        <label>Blockers / Issues</label>
        <input type="text" placeholder="Any technical difficulties?" />
      </div>

      <button className="submit-report-btn">
        <Send size={18} />
        Submit Daily Report
      </button>
    </div>
  </div>
);

export default WorkReports;
