import React from 'react';
import { 
  CreditCard, 
  ArrowUpCircle, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  { 
    name: 'Starter', 
    price: '$99', 
    icon: Zap,
    features: ['Up to 10 clients', 'Basic analytics', 'Email support', 'Single user access'], 
    current: false,
    color: '#64748B'
  },
  { 
    name: 'Professional', 
    price: '$299', 
    icon: ShieldCheck,
    features: ['Up to 50 clients', 'Advanced reports', 'Priority support', 'Team collaboration'], 
    current: false,
    color: '#3B82F6'
  },
  { 
    name: 'Enterprise Suite', 
    price: '$499', 
    icon: Crown,
    features: ['Unlimited clients', 'Full analytics suite', '24/7 Dedicated support', 'Custom integrations'], 
    current: true,
    color: '#7C3AED'
  },
];

const PlansTab = () => {
  return (
    <div className="tab-content plans-tab">
      <div className="tab-header-actions">
        <div className="tab-header-text">
          <h2>Billing & Plans</h2>
          <p className="text-muted">Manage your subscription and billing preferences.</p>
        </div>
      </div>

      <div className="billing-summary-cards mb-8">
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
          <motion.div 
            key={idx} 
            className={`plan-card ${plan.current ? 'active' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {plan.current && <div className="active-ribbon">Active</div>}
            <div className="plan-icon-header" style={{ color: plan.color }}>
              <plan.icon size={32} />
            </div>
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
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlansTab;
