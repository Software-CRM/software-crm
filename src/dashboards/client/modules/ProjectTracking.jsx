import React from 'react';
import { ExternalLink } from 'lucide-react';

const ProjectTracking = () => (
  <div className="client-module-view">
    <div className="module-header">
      <h2>Project Tracking</h2>
      <p>Real-time updates on your software development projects.</p>
    </div>
    <div className="project-list-grid">
      <div className="client-project-card">
        <div className="project-top">
          <span className="tag">Development</span>
          <span className="status-badge active">In Progress</span>
        </div>
        <h3>Corporate Website Revamp</h3>
        <p>Phase 2: Backend integration and API optimization.</p>
        <div className="milestones">
          <div className="milestone-dot completed" title="UI Design"></div>
          <div className="milestone-dot completed" title="API Dev"></div>
          <div className="milestone-dot active" title="Integration"></div>
          <div className="milestone-dot" title="UAT"></div>
        </div>
        <button className="view-details-btn">Project Timeline <ExternalLink size={14} /></button>
      </div>
    </div>
  </div>
);

export default ProjectTracking;
