import React from 'react';
import { Download } from 'lucide-react';

const Billing = () => (
  <div className="client-module-view">
    <div className="module-header">
      <h2>Billing & Payments</h2>
      <p>Manage your invoices and track payment history.</p>
    </div>
    <div className="billing-grid">
      <div className="invoice-card">
        <div className="inv-header">
          <span className="inv-num">INV-2026-004</span>
          <span className="inv-date">Issued: May 01</span>
        </div>
        <div className="inv-amount">$4,500.00</div>
        <div className="inv-status-unpaid">Pending Payment</div>
        <button className="download-btn"><Download size={16} /> Download PDF</button>
      </div>
    </div>
  </div>
);

export default Billing;
