import React from 'react';
import { AlertCircle } from 'lucide-react';

const ClientOverview = () => (
  <div className="client-dashboard-home">
    <div className="home-grid">
      <div className="welcome-banner">
        <div className="banner-text">
          <h1>Welcome to your Client Portal</h1>
          <p>Track your project progress, manage invoices, and communicate with your dedicated manager.</p>
        </div>
        <div className="banner-stats">
          <div className="b-stat"><span>02</span><p>Active Projects</p></div>
          <div className="b-stat"><span>01</span><p>Open Tickets</p></div>
        </div>
      </div>

      <div className="projects-preview-card">
        <h3>Current Progress</h3>
        <div className="progress-item-box">
          <div className="p-info">
            <span>Enterprise ERP Solution</span>
            <span>75%</span>
          </div>
          <div className="p-bar"><div className="p-fill" style={{ width: '75%' }}></div></div>
        </div>
      </div>

      <div className="support-quick-card">
        <AlertCircle className="icon" />
        <div>
          <h4>Need Support?</h4>
          <p>Our team is available 24/7 to help with any technical issues.</p>
        </div>
        <button className="support-btn">Raise Ticket</button>
      </div>
    </div>
  </div>
);

export default ClientOverview;
