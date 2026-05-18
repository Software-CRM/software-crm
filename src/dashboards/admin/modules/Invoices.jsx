import React from 'react';
import { 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

const invoices = [
  { id: 'INV-2026-001', date: 'May 01, 2026', amount: '$499.00', status: 'Paid', method: 'Visa •••• 4242' },
  { id: 'INV-2026-002', date: 'Apr 01, 2026', amount: '$499.00', status: 'Paid', method: 'Visa •••• 4242' },
  { id: 'INV-2026-003', date: 'Mar 01, 2026', amount: '$499.00', status: 'Failed', method: 'Visa •••• 4242' },
  { id: 'INV-2026-004', date: 'Feb 01, 2026', amount: '$299.00', status: 'Paid', method: 'Visa •••• 4242' },
];

const InvoicesTab = () => {
  return (
    <div className="tab-content invoices-tab">
      <div className="section-header">
        <div className="tab-header-text">
          <h2>Billing & Invoices</h2>
          <p className="text-muted">View and download your transaction history.</p>
        </div>
        <button className="secondary-btn">
          <Download size={18} />
          <span>Export All Invoices</span>
        </button>
      </div>

      <div className="table-container mt-6">
        <table className="modern-table">
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
              <motion.tr 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <td className="font-mono font-bold">
                  <div className="flex-center-gap">
                    <FileText size={14} className="text-muted" />
                    <span>{inv.id}</span>
                  </div>
                </td>
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
                  <button className="icon-btn" title="Download PDF">
                    <Download size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicesTab;
