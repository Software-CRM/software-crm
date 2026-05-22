import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  MoreVertical,
  X,
  CheckCircle2,
  Clock,
  PlayCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../../../services/userService';
import { projectService } from '../../../services/projectService';
import UserDetailsDrawer from '../components/UserDetailsDrawer';
import './DashboardOverview.css';
import { getRecentActivities, formatRelativeTime } from '../../../utils/activityLogger';

// eslint-disable-next-line no-unused-vars
const data = [
  { name: 'Jan', revenue: 4000, leads: 2400 },
  { name: 'Feb', revenue: 3000, leads: 1398 },
  { name: 'Mar', revenue: 2000, leads: 9800 },
  { name: 'Apr', revenue: 2780, leads: 3908 },
  { name: 'May', revenue: 1890, leads: 4800 },
  { name: 'Jun', revenue: 2390, leads: 3800 },
  { name: 'Jul', revenue: 3490, leads: 4300 },
];

const StatCard = ({ title, value, trend, icon: Icon, trendUp, onClick }) => (
  <motion.div
    className="stat-card-new"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={e => { if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick(); }}
    style={onClick ? { cursor: 'pointer' } : undefined}
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
  const [empCountOpen, setEmpCountOpen] = useState(false);
  const [empCount, setEmpCount] = useState(null);
  const [empList, setEmpList] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [empError, setEmpError] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const [mgrCountOpen, setMgrCountOpen] = useState(false);
  const [mgrCount, setMgrCount] = useState(null);
  const [mgrList, setMgrList] = useState([]);
  const [mgrLoading, setMgrLoading] = useState(false);
  const [mgrError, setMgrError] = useState(null);

  const [clientCountOpen, setClientCountOpen] = useState(false);
  const [clientCount, setClientCount] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientError, setClientError] = useState(null);

  // Projects state
  const [projectCountOpen, setProjectCountOpen] = useState(false);
  const [projectCount, setProjectCount] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState(null);
  const [projectSubView, setProjectSubView] = useState(null); // null | 'active' | 'inactive'

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Load recent activities
    setActivities(getRecentActivities());

    const fetchCounts = async () => {
      try {
        const [allUsers, allProjects] = await Promise.all([
          userService.getAllUsers(),
          projectService.getProjects()
        ]);
        const users = Array.isArray(allUsers)
          ? allUsers
          : Array.isArray(allUsers?.data)
            ? allUsers.data
            : Array.isArray(allUsers?.users)
              ? allUsers.users
              : [];
        const employees = users.filter((u) => (u.role || '').toString().toUpperCase() === 'EMPLOYEE');
        const managers = users.filter((u) => (u.role || '').toString().toUpperCase() === 'MANAGER');
        const clients = users.filter((u) => (u.role || '').toString().toUpperCase() === 'CLIENT');
        setEmpCount(employees.length);
        setMgrCount(managers.length);
        setClientCount(clients.length);
        const projects = Array.isArray(allProjects) ? allProjects : [];
        setProjectCount(projects.length);
      } catch (err) {
        console.error('Failed to pre-fetch counts', err);
      }
    };
    fetchCounts();
  }, []);

  const handleEmployeesClick = async () => {
    setEmpLoading(true);
    setEmpError(null);
    setEmpCount(null);
    setEmpList([]);
    setEmpCountOpen(true);
    try {
      const all = await userService.getAllUsers();
      const users = Array.isArray(all)
        ? all
        : Array.isArray(all?.data)
          ? all.data
          : Array.isArray(all?.users)
            ? all.users
            : [];
      const employees = users.filter((u) => (u.role || '').toString().toUpperCase() === 'EMPLOYEE');
      setEmpList(employees);
      setEmpCount(employees.length);
    } catch (err) {
      console.error('Failed to fetch employees', err);
      setEmpError(err.message || 'Failed to load employees');
    } finally {
      setEmpLoading(false);
    }
  };

  const handleManagersClick = async () => {
    setMgrLoading(true);
    setMgrError(null);
    setMgrCount(null);
    setMgrList([]);
    setMgrCountOpen(true);
    try {
      const all = await userService.getAllUsers();
      const users = Array.isArray(all)
        ? all
        : Array.isArray(all?.data)
          ? all.data
          : Array.isArray(all?.users)
            ? all.users
            : [];
      const managers = users.filter((u) => (u.role || '').toString().toUpperCase() === 'MANAGER');
      setMgrList(managers);
      setMgrCount(managers.length);
    } catch (err) {
      console.error('Failed to fetch managers', err);
      setMgrError(err.message || 'Failed to load managers');
    } finally {
      setMgrLoading(false);
    }
  };

  const handleClientsClick = async () => {
    setClientLoading(true);
    setClientError(null);
    setClientCount(null);
    setClientList([]);
    setClientCountOpen(true);
    try {
      const all = await userService.getAllUsers();
      const users = Array.isArray(all)
        ? all
        : Array.isArray(all?.data)
          ? all.data
          : Array.isArray(all?.users)
            ? all.users
            : [];
      const clients = users.filter((u) => (u.role || '').toString().toUpperCase() === 'CLIENT');
      setClientList(clients);
      setClientCount(clients.length);
    } catch (err) {
      console.error('Failed to fetch clients', err);
      setClientError(err.message || 'Failed to load clients');
    } finally {
      setClientLoading(false);
    }
  };

  const openEmployeeDetails = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setIsDetailsDrawerOpen(true);
  };

  const handleProjectsClick = async () => {
    setProjectLoading(true);
    setProjectError(null);
    setProjectList([]);
    setProjectSubView(null);
    setProjectCountOpen(true);
    try {
      const data = await projectService.getProjects();
      const projects = Array.isArray(data) ? data : [];
      setProjectList(projects);
      setProjectCount(projects.length);
    } catch (err) {
      console.error('Failed to fetch projects', err);
      setProjectError(err.message || 'Failed to load projects');
    } finally {
      setProjectLoading(false);
    }
  };

  return (
    <div className="tab-content overview-tab">
      <div className="stats-grid-new">
        <StatCard
          title="Total Clients"
          value={clientCount !== null ? clientCount : '0'}
          trend="+12.5%"
          icon={Users}
          trendUp={true}
          onClick={handleClientsClick}
        />
        <StatCard
          title="Total Projects"
          value={projectCount !== null ? projectCount : '0'}
          trend="-2.4%"
          icon={Briefcase}
          trendUp={false}
          onClick={handleProjectsClick}
        />
        <StatCard
          title="Total Managers"
          value={mgrCount !== null ? mgrCount : '0'}
          trend="+4.2%"
          icon={Users}
          trendUp={true}
          onClick={handleManagersClick}
        />
        <StatCard
          title="Employees"
          value={empCount !== null ? empCount : '0'}
          trend="+4.2%"
          icon={Users}
          trendUp={true}
          onClick={handleEmployeesClick}
        />
      </div>

      <div className="charts-grid">
        <div className="chart-container-card">
          <div className="card-header">
            <h3>Organisation Overview</h3>
            <span className="chart-subtitle">Live headcount &amp; project data</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Clients',  count: clientCount  || 0, color: '#6366f1' },
                  { name: 'Projects', count: projectCount || 0, color: '#0ea5e9' },
                  { name: 'Managers', count: mgrCount     || 0, color: '#f59e0b' },
                  { name: 'Employees',count: empCount     || 0, color: '#10b981' },
                ]}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                barSize={52}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99,102,241,0.06)' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.10)',
                    fontSize: '13px'
                  }}
                  formatter={(value, name) => [value, name]}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {[
                    { name: 'Clients',  color: '#6366f1' },
                    { name: 'Projects', color: '#0ea5e9' },
                    { name: 'Managers', color: '#f59e0b' },
                    { name: 'Employees',color: '#10b981' },
                  ].map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="activity-panel-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="text-btn">View All</button>
          </div>
          <div className="activity-list-new">
            {activities.slice(0, 5).map((act, idx) => (
              <div key={act.id || idx} className="activity-item-new">
                <div className="activity-avatar">
                  <div className={`avatar-placeholder p-${(idx % 4) + 1}`}>
                    {act.avatarText}
                  </div>
                </div>
                <div className="activity-info">
                  <p className="activity-text">
                    <strong>{act.fullName}</strong>{act.action}
                  </p>
                  <span className="activity-time">{formatRelativeTime(act.timestamp)}</span>
                </div>
                <ArrowUpRight size={14} className="activity-arrow" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Employees count modal */}
      {empCountOpen && (
        <div className="employee-modal-overlay" onClick={() => setEmpCountOpen(false)}>
          <div className="employee-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="employee-modal-header">
              <div>
                <h3>Employees</h3>
                <p>{empCount !== null ? `${empCount} employee${empCount === 1 ? '' : 's'}` : 'Employee roster'}</p>
              </div>
              <button className="employee-modal-close" onClick={() => setEmpCountOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="employee-table-wrapper">
              {empLoading ? (
                <div className="employee-no-data">Loading employee list…</div>
              ) : empError ? (
                <div className="employee-no-data" style={{ color: '#dc2626' }}>{empError}</div>
              ) : empList.length === 0 ? (
                <div className="employee-no-data">No employees found.</div>
              ) : (
                <div className="employee-table-container">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empList.map((employee) => (
                        <tr key={employee.id || employee.userId || employee.username}>
                          <td>
                            <div className="employee-name-cell">
                              <span className="employee-name-badge">{(employee.fullName || employee.username || 'U').charAt(0)}</span>
                              <span>{employee.fullName || employee.username || 'Unnamed User'}</span>
                            </div>
                          </td>
                          <td>
                            <button
                              className="employee-action-btn"
                              onClick={() => openEmployeeDetails(employee.id || employee.userId || employee.username)}
                              type="button"
                              aria-label={`View details for ${employee.fullName || employee.username}`}
                            >
                              <ArrowRight size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="employee-modal-footer">
              <button className="secondary-btn" onClick={() => setEmpCountOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Managers count modal */}
      {mgrCountOpen && (
        <div className="employee-modal-overlay" onClick={() => setMgrCountOpen(false)}>
          <div className="employee-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="employee-modal-header">
              <div>
                <h3>Managers</h3>
                <p>{mgrCount !== null ? `${mgrCount} manager${mgrCount === 1 ? '' : 's'}` : 'Manager roster'}</p>
              </div>
              <button className="employee-modal-close" onClick={() => setMgrCountOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="employee-table-wrapper">
              {mgrLoading ? (
                <div className="employee-no-data">Loading manager list…</div>
              ) : mgrError ? (
                <div className="employee-no-data" style={{ color: '#dc2626' }}>{mgrError}</div>
              ) : mgrList.length === 0 ? (
                <div className="employee-no-data">No managers found.</div>
              ) : (
                <div className="employee-table-container">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Manager's Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mgrList.map((manager) => (
                        <tr key={manager.id || manager.userId || manager.username}>
                          <td>
                            <div className="employee-name-cell">
                              <span className="employee-name-badge">{(manager.fullName || manager.username || 'M').charAt(0)}</span>
                              <span>{manager.fullName || manager.username || 'Unnamed Manager'}</span>
                            </div>
                          </td>
                          <td>
                            <button
                              className="employee-action-btn"
                              onClick={() => openEmployeeDetails(manager.id || manager.userId || manager.username)}
                              type="button"
                              aria-label={`View details for ${manager.fullName || manager.username}`}
                            >
                              <ArrowRight size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="employee-modal-footer">
              <button className="secondary-btn" onClick={() => setMgrCountOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Clients count modal */}
      {clientCountOpen && (
        <div className="employee-modal-overlay" onClick={() => setClientCountOpen(false)}>
          <div className="employee-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="employee-modal-header">
              <div>
                <h3>Clients</h3>
                <p>{clientCount !== null ? `${clientCount} client${clientCount === 1 ? '' : 's'}` : 'Client roster'}</p>
              </div>
              <button className="employee-modal-close" onClick={() => setClientCountOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="employee-table-wrapper">
              {clientLoading ? (
                <div className="employee-no-data">Loading client list…</div>
              ) : clientError ? (
                <div className="employee-no-data" style={{ color: '#dc2626' }}>{clientError}</div>
              ) : clientList.length === 0 ? (
                <div className="employee-no-data">No clients found.</div>
              ) : (
                <div className="employee-table-container">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Client's Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientList.map((client) => (
                        <tr key={client.id || client.userId || client.username}>
                          <td>
                            <div className="employee-name-cell">
                              <span className="employee-name-badge">{(client.fullName || client.username || 'C').charAt(0)}</span>
                              <span>{client.fullName || client.username || 'Unnamed Client'}</span>
                            </div>
                          </td>
                          <td>
                            <button
                              className="employee-action-btn"
                              onClick={() => openEmployeeDetails(client.id || client.userId || client.username)}
                              type="button"
                              aria-label={`View details for ${client.fullName || client.username}`}
                            >
                              <ArrowRight size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="employee-modal-footer">
              <button className="secondary-btn" onClick={() => setClientCountOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Modal */}
      {projectCountOpen && (() => {
        const activeProjects = projectList.filter(p => {
          const s = (p.status || '').toUpperCase();
          return s === 'PENDING' || s === 'IN_PROGRESS' || s === 'INPROGRESS';
        });
        const inactiveProjects = projectList.filter(p => {
          const s = (p.status || '').toUpperCase();
          return s === 'COMPLETED';
        });

        const formatDate = (d) => {
          if (!d) return '—';
          try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
          catch { return d; }
        };

        const statusTag = (status) => {
          const s = (status || '').toUpperCase();
          if (s === 'PENDING') return <span className="proj-status-tag pending"><Clock size={11} /> Pending</span>;
          if (s === 'IN_PROGRESS' || s === 'INPROGRESS') return <span className="proj-status-tag inprogress"><PlayCircle size={11} /> In Progress</span>;
          if (s === 'COMPLETED') return <span className="proj-status-tag completed"><CheckCircle2 size={11} /> Completed</span>;
          return <span className="proj-status-tag">{status}</span>;
        };

        return (
          <div className="employee-modal-overlay" onClick={() => setProjectCountOpen(false)}>
            <div className="employee-modal-card" onClick={e => e.stopPropagation()}>
              <div className="employee-modal-header">
                <div>
                  {projectSubView ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button
                        className="proj-back-btn"
                        onClick={() => setProjectSubView(null)}
                        aria-label="Back to categories"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h3>{projectSubView === 'active' ? 'Active Projects' : 'Completed Projects'}</h3>
                        <p>
                          {projectSubView === 'active'
                            ? `${activeProjects.length} project${activeProjects.length !== 1 ? 's' : ''} (Pending & In Progress)`
                            : `${inactiveProjects.length} project${inactiveProjects.length !== 1 ? 's' : ''} completed`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3>Total Projects</h3>
                      <p>{projectCount !== null ? `${projectCount} project${projectCount !== 1 ? 's' : ''} in total` : 'Project overview'}</p>
                    </div>
                  )}
                </div>
                <button className="employee-modal-close" onClick={() => setProjectCountOpen(false)}><X size={18} /></button>
              </div>

              <div className="employee-table-wrapper">
                {projectLoading ? (
                  <div className="employee-no-data">Loading projects…</div>
                ) : projectError ? (
                  <div className="employee-no-data" style={{ color: '#dc2626' }}>{projectError}</div>
                ) : !projectSubView ? (
                  /* ── Category Selection View ── */
                  <div className="proj-category-list">
                    <AnimatePresence>
                      {/* Active card */}
                      <motion.div
                        className="proj-category-card active-card"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="proj-cat-icon active-icon">
                          <PlayCircle size={22} />
                        </div>
                        <div className="proj-cat-info">
                          <span className="proj-cat-label">Active Projects</span>
                          <span className="proj-cat-sub">Pending &amp; In Progress</span>
                        </div>
                        <div className="proj-cat-count active-count">{activeProjects.length}</div>
                        <button
                          className="proj-cat-arrow"
                          onClick={() => setProjectSubView('active')}
                          aria-label="View active projects"
                        >
                          <ArrowRight size={18} />
                        </button>
                      </motion.div>

                      {/* Inactive card */}
                      <motion.div
                        className="proj-category-card inactive-card"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.08 }}
                      >
                        <div className="proj-cat-icon inactive-icon">
                          <CheckCircle2 size={22} />
                        </div>
                        <div className="proj-cat-info">
                          <span className="proj-cat-label">Inactive Projects</span>
                          <span className="proj-cat-sub">Completed</span>
                        </div>
                        <div className="proj-cat-count inactive-count">{inactiveProjects.length}</div>
                        <button
                          className="proj-cat-arrow"
                          onClick={() => setProjectSubView('inactive')}
                          aria-label="View inactive projects"
                        >
                          <ArrowRight size={18} />
                        </button>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ) : (
                  /* ── Project List Sub-View ── */
                  (() => {
                    const list = projectSubView === 'active' ? activeProjects : inactiveProjects;
                    return list.length === 0 ? (
                      <div className="employee-no-data">No projects found.</div>
                    ) : (
                      <div className="employee-table-container">
                        <table className="employee-table">
                          <thead>
                            <tr>
                              <th>Project Name</th>
                              <th>Status</th>
                              <th>Start Date</th>
                              <th>End Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {list.map(project => (
                              <tr key={project.id}>
                                <td>
                                  <div className="employee-name-cell">
                                    <span className="proj-name-badge">{(project.name || 'P').charAt(0).toUpperCase()}</span>
                                    <span>{project.name || 'Unnamed Project'}</span>
                                  </div>
                                </td>
                                <td>{statusTag(project.status)}</td>
                                <td>{formatDate(project.startDate)}</td>
                                <td>{formatDate(project.endDate)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()
                )}
              </div>

              <div className="employee-modal-footer">
                <button className="secondary-btn" onClick={() => setProjectCountOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      <UserDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        userId={selectedEmployeeId}
      />
    </div>
  );
};

export default OverviewTab;
