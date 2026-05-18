import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  Save, 
  X, 
  AlertTriangle,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../../../services/userService';

const TeamMembers = ({ showToast }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    role: 'EMPLOYEE',
    status: 'Active'
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      if (Array.isArray(data)) {
        setEmployees(data.filter(u => u.role === 'EMPLOYEE'));
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const body = {
        fullName: formData.fullName,
        username: formData.username,
        role: 'EMPLOYEE',
        active: formData.status === 'Active'
      };

      if (formData.password && formData.password.trim() !== '') {
        body.password = formData.password;
      }

      if (isEditMode) {
        await userService.updateUser(selectedEmp.id, body);
      } else {
        await userService.createEmployee(body);
      }

      showToast('success', `Employee ${isEditMode ? 'updated' : 'created'} successfully!`);
      setIsModalOpen(false);
      fetchEmployees();
      setFormData({ username: '', password: '', role: 'EMPLOYEE', status: 'Active' });
    } catch (err) {
      console.error('Operation failed:', err);
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    setActionLoading(true);
    try {
      await userService.deleteUser(selectedEmp.id);
      showToast('success', 'Employee deleted successfully');
      setIsDeleteModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openEdit = (emp) => {
    setSelectedEmp(emp);
    setFormData({
      username: emp.username,
      fullName: emp.fullName || '',
      password: '',
      role: 'EMPLOYEE',
      status: emp.active === 1 || emp.status === 'Active' ? 'Active' : 'Inactive'
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  return (
    <div className="manager-tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Employee Management</h1>
          <p>Create, update, and manage your team members.</p>
        </div>
        <button className="primary-action-btn" onClick={() => { setIsEditMode(false); setIsModalOpen(true); }}>
          <Plus size={18} />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="manager-card-table">
        <div className="table-container sticky-header">
          <table className="modern-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>USERNAME</th>
                <th>STATUS</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-12"><Loader2 className="animate-spin text-primary" size={40} /></td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-12 text-muted">No employees found.</td></tr>
              ) : (
                employees.map((emp) => (
                  <motion.tr 
                    key={emp.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <td>
                      <div className="user-info-cell">
                        <div className="user-avatar-small">{(emp.fullName || emp.username)?.[0]?.toUpperCase()}</div>
                        <div className="user-details">
                          <span className="user-name-text">{emp.fullName || emp.username}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="user-meta-cell">
                        <Shield size={14} className="text-muted" />
                        <span>@{emp.username}</span>
                      </div>
                    </td>
                    <td>
                      <div className={`status-pill ${(emp.active === 1 || emp.active === true || emp.status === 'Active') ? 'active' : 'inactive'}`}>
                        {(emp.active === 1 || emp.active === true || emp.status === 'Active') ? <CheckCircle2 size={12} /> : <X size={12} />}
                        <span>{(emp.active === 1 || emp.active === true || emp.status === 'Active') ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>

                    <td>
                      <div className="action-btns">
                        <button className="icon-btn edit" onClick={() => openEdit(emp)} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="icon-btn delete" onClick={() => { setSelectedEmp(emp); setIsDeleteModalOpen(true); }} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content side-drawer" 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="modal-header">
                <div>
                  <h3>{isEditMode ? 'Edit Employee Details' : 'Add New Employee'}</h3>
                  <p>{isEditMode ? `Update information for ${selectedEmp?.fullName}` : 'Add a new member to your team'}</p>
                </div>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveEmployee} className="modal-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Robert Fox"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    name="username" 
                    value={formData.username} 
                    onChange={handleInputChange} 
                    placeholder="e.g. robert_fox"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>{isEditMode ? 'New Password (Leave blank to keep current)' : 'Password'}</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    placeholder="••••••••"
                    required={!isEditMode} 
                  />
                </div>
                {isEditMode && (
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="premium-select">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                )}
                <div className="modal-footer">
                  <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="primary-btn" disabled={actionLoading}>
                    {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>{isEditMode ? 'Save Changes' : 'Create Employee'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content centered-modal" 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="delete-confirm-icon">
                <AlertTriangle size={32} />
              </div>
              <div className="text-center mb-6">
                <h3>Delete Employee?</h3>
                <p>Are you sure you want to delete <strong>{selectedEmp?.fullName}</strong>? This action cannot be undone.</p>
              </div>
              <div className="modal-footer flex-center">
                <button className="secondary-btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                <button className="danger-btn" onClick={handleDeleteEmployee} disabled={actionLoading}>
                  {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  <span>Delete Employee</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamMembers;


