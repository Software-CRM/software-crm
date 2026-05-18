import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Shield,
  Briefcase,
  ChevronRight,
  Edit2,
  Trash2,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectService } from '../../../services/projectService';
import { userService } from '../../../services/userService';
import './ProjectManagement.css';

const ProjectManagementTab = ({ showToast = (type, msg) => alert(msg) }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log("DEBUG: Starting fetchProjects...");

      const data = await projectService.getProjects();

      console.log("DEBUG: Fetched Projects Raw Data:", data);

      const projectList =
        data?.content ||
        data?.data ||
        data ||
        [];

      setProjects(Array.isArray(projectList) ? projectList : []);

    } catch (err) {
      console.error("Project fetch error:", err);
      showToast('error', err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await projectService.deleteProject(id);
      showToast('success', 'Project deleted successfully');
      fetchProjects();
    } catch (err) {
      showToast('error', 'Delete failed: ' + err.message);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="tab-header">
        <div>
          <h1>Project Management</h1>
          <p>Orchestrate organizational projects, assign cross-functional talent, and track milestones.</p>
        </div>
        <button className="primary-action-btn" onClick={() => { setIsEditMode(false); setSelectedProject(null); setIsModalOpen(true); }}>
          <Plus size={18} />
          <span>Create Project</span>
        </button>
      </div>

      <div className="project-grid">
        {loading ? (
          <div className="loading-state"><Loader2 className="animate-spin" /> Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">No projects found. Create one to get started!</div>
        ) : (
          projects.map(project => (
            <motion.div
              key={project.id}
              className="project-card-premium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="card-top">
                <span className={`status-pill-small ${project.status?.toLowerCase().replace(' ', '-') || 'pending'}`}>
                  {project.status}
                </span>
                <div className="card-actions-dropdown">
                  <button className="icon-btn-small" onClick={() => { setSelectedProject(project); setIsEditMode(true); setIsModalOpen(true); }}><Edit2 size={14} /></button>
                  <button className="icon-btn-small delete" onClick={() => handleDelete(project.id)}><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="card-body">
                <span className="project-id">{project.id}</span>
                <h3>{project.name}</h3>
                <p>{project.description || 'No description available'}</p>

                <div className="project-meta-info">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}</span>
                  </div>
                  <div className="meta-item">
                    <Shield size={14} />
                    <span>{project.priority} Priority</span>
                  </div>
                </div>

                <div className="skill-tags">
                  {project.skills?.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
                </div>
              </div>

              <div className="card-footer">
                <div className="assigned-team">
                  {project.managerName !== 'Unassigned' ? (
                    <div className="team-avatar-mini" title={project.managerName}>
                      {project.managerName[0].toUpperCase()}
                    </div>
                  ) : (
                    <span className="no-team">No manager assigned</span>
                  )}
                  {project.managerName !== 'Unassigned' && (
                    <span className="manager-name-footer">
                      @{project.managerName}
                    </span>
                  )}
                </div>
                <button className="details-link-btn">
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ProjectModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => { fetchProjects(); setIsModalOpen(false); }}
            initialData={selectedProject}
            isEditMode={isEditMode}
            showToast={showToast}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectModal = ({ onClose, onSuccess, initialData, isEditMode, showToast }) => {
  const [step, setStep] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(initialData ? {
    ...initialData,
    startDate: initialData.startDate?.split('T')[0] || '',
    endDate: initialData.endDate?.split('T')[0] || '',
    manager: initialData.manager || null
  } : {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'Medium',
    department: '',
    skills: [],
    status: 'Pending',
    manager: null
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await userService.getAllUsers();

        const talent = data
          .filter(u => u.role?.toUpperCase() === 'MANAGER')
          .map(u => ({
            id: u.id,
            username: u.username,
            fullName: u.fullName || u.username,
            role: u.role,
            workload: 0,
            status: 'Available'
          }));

        setEmployees(talent);
      } catch (err) {
        console.error('Talent fetch error:', err);
      }
    };
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEmployee = (emp) => {
    // Switch to singular manager assignment
    setFormData(prev => ({
      ...prev,
      manager: {
        id: emp.id,
        username: emp.username,
        role: 'MANAGER'
      }
    }));
  };

  const updateAssignment = (username, field, value) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.map(a =>
        a.userId === username ? { ...a, [field]: value } : a
      )
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        name: formData.name,

        description: formData.description || "",

        startDate: formData.startDate
          ? `${formData.startDate}T00:00:00`
          : null,

        endDate: formData.endDate
          ? `${formData.endDate}T00:00:00`
          : null,

        priority: (formData.priority || 'MEDIUM').toUpperCase(),

        department: formData.department || "GENERAL",

        skills: Array.isArray(formData.skills)
          ? formData.skills
          : [],

        managerId: formData.manager?.id || null,
        managerRole: 'MANAGER',
        status: (formData.status || 'PENDING').toUpperCase()
      };

      console.log("DEBUG: Submitting Project Payload:", payload);
      
      if (isEditMode) {
        await projectService.updateProject(initialData.id, payload);
      } else {
        await projectService.createProject(payload);
      }

      showToast('success', `Project ${isEditMode ? 'updated' : 'created'} successfully!`);
      onSuccess();
    } catch (err) {
      console.error('handleSubmit error:', err);
      showToast('error', err.message);
    }
  };

  const filteredEmployees = employees.filter(e =>
    e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-content project-wizard"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="wizard-sidebar">
          <div className="wizard-header">
            <div className="icon-circle"><Briefcase size={20} /></div>
            <h3>{isEditMode ? 'Edit Project' : 'New Project'}</h3>
          </div>
          <div className="wizard-steps">
            <div className={`wizard-step ${step === 1 ? 'active' : ''}`}>
              <div className="step-num">1</div>
              <div className="step-info">
                <span>Core Details</span>
                <p>Objective & Timeline</p>
              </div>
            </div>
            <div className={`wizard-step ${step === 2 ? 'active' : ''}`}>
              <div className="step-num">2</div>
              <div className="step-info">
                <span>Team Talent</span>
                <p>Assignments & Roles</p>
              </div>
            </div>
          </div>
          <div className="wizard-footer-hint">
            <Shield size={14} />
            <p>Projects are visible to assigned team members immediately after publishing.</p>
          </div>
        </div>

        <div className="wizard-main">
          <div className="wizard-body">
            {step === 1 ? (
              <div className="step-content animate-in">
                <div className="form-section">
                  <label>Project Identity</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Next-Gen Mobile CRM"
                    className="premium-input"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the project scope and key objectives..."
                    className="premium-textarea"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="premium-input" />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="premium-input" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleInputChange} className="premium-select">
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input name="department" value={formData.department} onChange={handleInputChange} placeholder="e.g. Engineering" className="premium-input" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Required Skills (Comma separated)</label>
                  <input
                    placeholder="e.g. React, Node.js, AWS"
                    onBlur={(e) => setFormData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))}
                    defaultValue={formData.skills?.join(', ')}
                    className="premium-input"
                  />
                </div>
              </div>
            ) : (
              <div className="step-content animate-in">
                <div className="selection-header">
                  <div className="search-with-filter">
                    <Search size={18} />
                    <input
                      placeholder="Search managers by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="talent-selector-grid">
                  <div className="talent-list-panel">
                    <label>Available Managers</label>
                    <div className="talent-scroll-area">
                      {filteredEmployees.map(emp => {
                        const isSelected = formData.manager?.username === emp.username;
                        return (
                          <div
                            key={emp.username}
                            className={`talent-card ${isSelected ? 'active' : ''}`}
                            onClick={() => toggleEmployee(emp)}
                          >
                            <div className="talent-info">
                              <div className="talent-avatar">{emp.fullName[0]}</div>
                              <div className="talent-name-role">
                                <strong>{emp.fullName}</strong>
                                <span>{emp.role}</span>
                              </div>
                            </div>
                            <div className="select-indicator">
                              {isSelected ? <CheckCircle size={18} /> : <Plus size={18} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="assignment-config-panel">
                    <label>Assigned Project Manager</label>
                    <div className="assignment-scroll-area">
                      {!formData.manager ? (
                        <div className="empty-selection">No manager assigned. Select from the left.</div>
                      ) : (
                        <div className="assignment-item-minimal">
                          <div className="a-avatar">{formData.manager.username[0].toUpperCase()}</div>
                          <div className="a-details">
                            <div className="a-name">{formData.manager.fullName || formData.manager.username}</div>
                            <div className="static-role-badge">MANAGER</div>
                          </div>
                          <button
                            type="button"
                            className="a-remove-btn"
                            title="Remove Selection"
                            onClick={() => setFormData(prev => ({ ...prev, manager: null }))}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="wizard-actions">
            <button className="secondary-btn" onClick={onClose}>Cancel</button>
            <div className="action-group">
              {step === 2 && (
                <button className="secondary-btn" onClick={() => setStep(1)}>
                  <ArrowLeft size={18} /> Back
                </button>
              )}
              {step === 1 ? (
                <button className="primary-btn" onClick={() => setStep(2)}>
                  Next: Assign Team <ArrowRight size={18} />
                </button>
              ) : (
                <button className="primary-btn success" onClick={handleSubmit}>
                  <Save size={18} /> {isEditMode ? 'Save Changes' : 'Publish Project'}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectManagementTab;



