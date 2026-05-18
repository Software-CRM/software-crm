import React from 'react';
import { 
  CreditCard, 
  Download, 
  ArrowUpCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

const invoices = [
  { id: 'INV-2026-001', date: 'May 01, 2026', amount: '$499.00', status: 'Paid', method: 'Visa •••• 4242' },
  { id: 'INV-2026-002', date: 'Apr 01, 2026', amount: '$499.00', status: 'Paid', method: 'Visa •••• 4242' },
  { id: 'INV-2026-003', date: 'Mar 01, 2026', amount: '$499.00', status: 'Failed', method: 'Visa •••• 4242' },
  { id: 'INV-2026-004', date: 'Feb 01, 2026', amount: '$299.00', status: 'Paid', method: 'Visa •••• 4242' },
];

const plans = [
  { name: 'Starter', price: '$99', features: ['Up to 10 clients', 'Basic analytics', 'Email support'], current: false },
  { name: 'Professional', price: '$299', features: ['Up to 50 clients', 'Advanced reports', 'Priority support', 'Team collab'], current: false },
  { name: 'Enterprise', price: '$499', features: ['Unlimited clients', 'Full analytics suite', '24/7 Dedicated support', 'Custom integrations'], current: true },
];

const BillingTab = () => {
  return (
    <div className="tab-content billing-tab">
      <div className="billing-summary-cards">
        <div className="billing-card-main">
          <div className="card-top">
            <div className="plan-badge">CURRENT PLAN</div>
            <h3>Enterprise Suite</h3>
            <p className="plan-expiry">Renews on June 01, 2026</p>
          </div>
          <div className="card-bottom">
            <h2 className="price-text">$499<span>/month</span></h2>
            <button className="upgrade-btn">
              <ArrowUpCircle size={18} />
              <span>Change Plan</span>
            </button>
          </div>
        </div>

        <div className="payment-method-card">
          <div className="card-header">
            <h3>Payment Method</h3>
            <button className="text-btn">Edit</button>
          </div>
          <div className="method-details">
            <div className="card-chip-icon">
              <CreditCard size={32} />
            </div>
            <div className="method-info">
              <p className="card-brand">Visa Corporate Card</p>
              <p className="card-numbers">•••• •••• •••• 4242</p>
              <p className="card-expiry">Expires 12/28</p>
            </div>
          </div>
        </div>
      </div>

      <div className="plans-comparison-grid">
        {plans.map((plan, idx) => (
          <div key={idx} className={`plan-card ${plan.current ? 'active' : ''}`}>
            {plan.current && <div className="active-ribbon">Active</div>}
            <h4>{plan.name}</h4>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">{plan.price.replace('$', '')}</span>
              <span className="period">/mo</span>
            </div>
            <ul className="plan-features">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx}>
                  <CheckCircle2 size={16} className="feature-icon" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className={`plan-action-btn ${plan.current ? 'current' : ''}`}>
              {plan.current ? 'Current Plan' : 'Choose ' + plan.name}
            </button>
          </div>
        ))}
      </div>

      <div className="invoice-history-section">
        <div className="section-header">
          <h3>Invoice History</h3>
          <button className="secondary-btn btn-sm">
            <Download size={16} />
            <span>Export All</span>
          </button>
        </div>
        <div className="table-container">
          <table className="modern-table billing-table">
            <thead>
              <tr>
                <th>INVOICE ID</th>
                <th>BILLING DATE</th>
                <th>AMOUNT</th>
                <th>PAYMENT METHOD</th>
                <th>STATUS</th>
                <th className="text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={idx}>
                  <td className="font-mono">{inv.id}</td>
                  <td>{inv.date}</td>
                  <td className="font-bold">{inv.amount}</td>
                  <td>{inv.method}</td>
                  <td>
                    <div className={`status-pill ${inv.status.toLowerCase()}`}>
                      {inv.status === 'Paid' ? <CheckCircle2 size={12} /> : 
                       inv.status === 'Failed' ? <AlertCircle size={12} /> : <Clock size={12} />}
                      <span>{inv.status}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button className="download-invoice-btn" title="Download PDF">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;
