import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Calendar, 
  Filter, 
  Download, 
  FileText, 
  PieChart as PieIcon,
  BarChart2,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const performanceData = [
  { name: 'Week 1', sales: 400, support: 240, research: 200 },
  { name: 'Week 2', sales: 300, support: 139, research: 221 },
  { name: 'Week 3', sales: 200, support: 980, research: 229 },
  { name: 'Week 4', sales: 278, support: 390, research: 200 },
];

const distributionData = [
  { name: 'Sales', value: 400 },
  { name: 'Marketing', value: 300 },
  { name: 'Development', value: 300 },
  { name: 'Operations', value: 200 },
];

const COLORS = ['#1E3A8A', '#3B82F6', '#64748B', '#94A3B8'];

const ReportsTab = () => {
  return (
    <div className="tab-content reports-tab">
      <div className="reports-top-bar">
        <div className="report-filters">
          <div className="date-picker-btn">
            <Calendar size={18} />
            <span>May 01 - May 31, 2026</span>
          </div>
          <button className="secondary-btn btn-sm">
            <Filter size={16} />
            <span>All Departments</span>
          </button>
        </div>
        <div className="report-actions">
          <button className="secondary-btn btn-sm">
            <FileText size={16} />
            <span>View PDF</span>
          </button>
          <button className="primary-btn btn-sm">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="reports-grid">
        <motion.div 
          className="report-card large"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="card-header">
            <div>
              <h3>Team Performance Metrics</h3>
              <p>Productivity breakdown across departments</p>
            </div>
            <BarChart2 size={24} className="muted-icon" />
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar dataKey="sales" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="support" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="research" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          className="report-card small"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-header">
            <h3>Revenue Distribution</h3>
            <PieIcon size={24} className="muted-icon" />
          </div>
          <div className="chart-wrapper pie-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {distributionData.map((d, i) => (
                <div key={i} className="legend-item">
                  <span className="dot" style={{ backgroundColor: COLORS[i] }}></span>
                  <span className="label">{d.name}</span>
                  <span className="val">{((d.value/1200)*100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="report-card medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <div>
              <h3>Engagement Trend</h3>
              <p>User interaction over time</p>
            </div>
            <TrendingUp size={24} className="muted-icon" />
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsTab;
