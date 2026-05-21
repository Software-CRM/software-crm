import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const TeamPerformance = () => {
  const data = [
    { name: 'Week 1', completed: 12, pending: 8 },
    { name: 'Week 2', completed: 18, pending: 5 },
    { name: 'Week 3', completed: 15, pending: 10 },
    { name: 'Week 4', completed: 25, pending: 3 },
  ];

  const COLORS = ['#1e3a8a', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="manager-tab-content">
      <div className="tab-header">
        <div>
          <h1>Performance Analytics</h1>
          <p>Detailed insights into team productivity and sprint velocity.</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Task Completion Rate</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Workload Distribution</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Frontend', value: 400 },
                    { name: 'Backend', value: 300 },
                    { name: 'UI/UX', value: 200 },
                    { name: 'DevOps', value: 100 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPerformance;
