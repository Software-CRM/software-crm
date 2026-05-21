import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Shield, 
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../../../services/userService';

const UserManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    role: 'MANAGER',
    password: '',
    status: 'Active'
  });
  
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      
      if (Array.isArray(data)) {
        const mappedUsers = data.map(user => {
          // Robust status check for Spring Boot/Hibernate boolean/bit types
          const isActive = user.active === true || 
                          user.active === 1 || 
                          user.active === '1' || 
                          user.active === 'true' || 
                          user.status === 'Active';
                          
          return {
            ...user,
            id: user.id || user.userId,
            role: user.role?.toUpperCase() || 'EMPLOYEE',
            status: isActive ? 'Active' : 'Inactive',
            fullName: user.fullName || user.username || 'Unnamed User'
          };
        });
        setUsers(mappedUsers);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showToast('error', `Fetch Error: ${err.message}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      username: '',
      fullName: '',
      role: 'MANAGER',
      password: '',
      status: 'Active'
    });
    setSelectedUser(null);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      // Determine the correct service call based on role
      if (formData.role === 'EMPLOYEE') {
        await userService.createEmployee(formData);
      } else if (formData.role === 'MANAGER') {
        await userService.createManager(formData);
      } else if (formData.role === 'CLIENT') {
        await userService.createClient(formData);
      } else {
        // Fallback for any other roles
        await userService.createEmployee(formData);
      }
      
      showToast('success', `${formData.role.charAt(0) + formData.role.slice(1).toLowerCase()} Created Successfully`);
      setIsCreateModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error('Creation error:', err);
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await userService.updateUser(selectedUser.id, {
        username: formData.username,
        password: formData.password || undefined,
        role: formData.role,
        active: formData.status === 'Active' ? 1 : 0
      });
      
      showToast('success', 'User Updated Successfully');
      setIsEditModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setActionLoading(true);
    try {
      if (!selectedUser?.id) {
        throw new Error("Unable to identify user ID. Please refresh the list.");
      }

      await userService.deleteUser(selectedUser.id);
      
      showToast('success', 'User Deleted Successfully');
      setIsDeleteModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      status: user.status || 'Active',
      password: ''
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.username?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeClass = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return 'role-badge purple';
      case 'MANAGER': return 'role-badge blue';
      case 'EMPLOYEE': return 'role-badge green';
      case 'CLIENT': return 'role-badge orange';
      default: return 'role-badge';
    }
  };



  return (
    <div className="tab-content user-management-tab">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`toast-notification ${toast.type}`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="tab-header-actions">
        <div className="tab-header-text">
          <h2>User Management</h2>
          <p className="text-muted">
            Manage your organization's users and their roles. 
            <strong> {users.length} users</strong> registered.
          </p>
        </div>
        <div className="action-buttons-group">

          <button className="primary-btn" onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
            <Plus size={18} />
            <span>Create User</span>
          </button>
        </div>

      </div>

      <div className="search-filter-group mb-6">
        <div className="search-box">
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search by name or username..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-dropdown">
          <Filter size={18} className="text-muted" />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="CLIENT">Client</option>
          </select>
        </div>
        {searchQuery || roleFilter !== 'ALL' ? (
          <button className="text-btn" onClick={() => { setSearchQuery(''); setRoleFilter('ALL'); }}>
            Reset Filters
          </button>
        ) : null}
      </div>

      <div className="table-wrapper">
        <div className="table-container sticky-header">
          <table className="modern-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <div className="loading-state">
                      <Loader2 className="animate-spin text-primary" size={40} />
                      <p className="font-bold mt-4">Syncing with user database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <div className="empty-state">
                      <div className="empty-icon-wrapper">
                        <UserIcon size={48} className="text-muted opacity-20" />
                      </div>
                      <h4 className="mt-4 font-bold">No users found</h4>
                      <p className="text-muted">Try adjusting your search or filters to find what you're looking for.</p>
                      <button 
                        className="secondary-btn mt-6"
                        onClick={() => { setSearchQuery(''); setRoleFilter('ALL'); }}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <motion.tr 
                    key={user.username}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <td>
                      <div className="user-info-cell">
                        <div className="user-avatar-small">
                          {user.fullName?.charAt(0) || user.username?.charAt(0)}
                        </div>
                        <div className="user-details">
                          <span className="user-name-text">{user.fullName}</span>
                          <span className="user-id-text">@{user.username}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className={getRoleBadgeClass(user.role)}>
                        <Shield size={12} />
                        <span>{user.role}</span>
                      </div>
                    </td>
                    <td>
                      <div className={`status-pill ${user.status?.toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
                        {user.status?.toLowerCase() === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        <span>{user.status || 'Active'}</span>
                      </div>
                    </td>

                    <td>
                      <div className="action-btns">
                        {(user.role === 'MANAGER' || user.role === 'CLIENT' || user.role === 'EMPLOYEE') && (
                          <>
                            <button 
                              className="icon-btn edit" 
                              title="Edit"
                              onClick={() => openEditModal(user)}
                            >
                              <Edit2 size={16} />
                            </button>
                            {user.role !== 'ADMIN' && (
                              <button 
                                className="icon-btn delete" 
                                title="Delete"
                                onClick={() => openDeleteModal(user)}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination-bar">
        <span className="pagination-info">
          Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
        </span>
        <div className="pagination-buttons">
          <button className="pag-btn" disabled>Previous</button>
          <button className="pag-btn active">1</button>
          <button className="pag-btn" disabled>Next</button>
        </div>
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
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
                  <h3>Create New User</h3>
                  <p>Add a new member to the organization</p>
                </div>
                <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="modal-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
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
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="e.g. robert_fox"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange}>
                    <option value="MANAGER">Manager</option>
                    <option value="CLIENT">Client</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="secondary-btn" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-btn" disabled={actionLoading}>
                    {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    <span>Create User</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content side-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
            >
              <div className="modal-header">
                <div>
                  <h3>Edit User Details</h3>
                  <p>Update information for {selectedUser?.fullName}</p>
                </div>
                <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleUpdateUser} className="modal-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange}>
                    <option value="MANAGER">Manager</option>
                    <option value="CLIENT">Client</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <div className="status-toggle-group">
                    <span className={formData.status === 'Active' ? 'text-success font-bold' : 'text-muted'}>Active</span>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={formData.status === 'Active'} 
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 'Active' : 'Inactive' }))}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className={formData.status === 'Inactive' ? 'text-danger font-bold' : 'text-muted'}>Inactive</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>New Password (leave blank to keep current)</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="secondary-btn" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-btn" disabled={actionLoading}>
                    {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
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
                <h3>Delete User?</h3>
                <p>Are you sure you want to delete <strong>{selectedUser?.fullName}</strong>? This action cannot be undone.</p>
              </div>
              <div className="modal-footer flex-center">
                <button className="secondary-btn" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </button>
                <button 
                  className="danger-btn" 
                  onClick={handleDeleteUser}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  <span>Delete User</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagementTab;



