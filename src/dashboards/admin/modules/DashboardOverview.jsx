import React from 'react';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', revenue: 4000, leads: 2400 },
  { name: 'Feb', revenue: 3000, leads: 1398 },
  { name: 'Mar', revenue: 2000, leads: 9800 },
  { name: 'Apr', revenue: 2780, leads: 3908 },
  { name: 'May', revenue: 1890, leads: 4800 },
  { name: 'Jun', revenue: 2390, leads: 3800 },
  { name: 'Jul', revenue: 3490, leads: 4300 },
];

const StatCard = ({ title, value, trend, icon: Icon, trendUp }) => (
  <motion.div 
    className="stat-card-new"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="stat-card-header">
      <div className="stat-icon-wrapper">
        <Icon size={20} />
      </div>
      <button className="card-action-btn"><MoreVertical size={16} /></button>
    </div>
    <div className="stat-card-body">
      <span className="stat-label">{title}</span>
      <h3 className="stat-value">{value}</h3>
      <div className={`stat-trend ${trendUp ? 'up' : 'down'}`}>
        {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{trend}</span>
        <span className="trend-text">since last month</span>
      </div>
    </div>
  </motion.div>
);

const OverviewTab = () => {
  return (
    <div className="tab-content overview-tab">
      <div className="stats-grid-new">
        <StatCard 
          title="Total Clients" 
          value="1,284" 
          trend="+12.5%" 
          icon={Users} 
          trendUp={true} 
        />
        <StatCard 
          title="Active Projects" 
          value="42" 
          trend="-2.4%" 
          icon={Briefcase} 
          trendUp={false} 
        />
        <StatCard 
          title="Total Revenue" 
          value="$142,500" 
          trend="+8.4%" 
          icon={DollarSign} 
          trendUp={true} 
        />
        <StatCard 
          title="Employees" 
          value="156" 
          trend="+4.2%" 
          icon={TrendingUp} 
          trendUp={true} 
        />
      </div>

      <div className="charts-grid">
        <div className="chart-container-card">
          <div className="card-header">
            <h3>Revenue Growth</h3>
            <div className="card-actions">
              <select className="minimal-select">
                <option>Last 7 months</option>
                <option>Last year</option>
              </select>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="activity-panel-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="text-btn">View All</button>
          </div>
          <div className="activity-list-new">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="activity-item-new">
                <div className="activity-avatar">
                  <div className={`avatar-placeholder p-${i}`}>
                    {['JS', 'BK', 'ML', 'AD'][i-1]}
                  </div>
                </div>
                <div className="activity-info">
                  <p className="activity-text">
                    <strong>{['John Smith', 'Beth Knight', 'Mike Lord', 'Amy Doe'][i-1]}</strong>
                    {[' added a new lead', ' updated project status', ' completed task', ' signed in'][i-1]}
                  </p>
                  <span className="activity-time">{i * 15}m ago</span>
                </div>
                <ArrowUpRight size={14} className="activity-arrow" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
