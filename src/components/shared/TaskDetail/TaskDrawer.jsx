import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  User, 
  Tag, 
  MessageSquare, 
  Paperclip, 
  CheckSquare,
  Activity,
  Send,
  MoreVertical
} from 'lucide-react';
import './TaskDrawer.css';

const TaskDrawer = ({ task, isOpen, onClose }) => {
  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="task-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="drawer-header">
              <div className="header-left">
                <span className="task-id-badge">{task.id}</span>
                <div className="task-type-indicator" style={{ backgroundColor: task.type === 'BUG' ? '#ef4444' : '#6366f1' }}></div>
              </div>
              <div className="header-actions">
                <button className="icon-btn"><MoreVertical size={18} /></button>
                <button className="close-btn" onClick={onClose}><X size={20} /></button>
              </div>
            </div>

            <div className="drawer-content">
              <h2 className="task-full-title">{task.title}</h2>
              
              <div className="task-status-row">
                <div className="status-selector">
                  <span className="label">Status</span>
                  <select defaultValue={task.status}>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="TESTING">Testing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div className="priority-selector">
                  <span className="label">Priority</span>
                  <div className={`priority-tag ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </div>
                </div>
              </div>

              <div className="task-details-grid">
                <div className="detail-item">
                  <User size={16} />
                  <span className="label">Assignee</span>
                  <div className="value">
                    <div className="avatar-sm">{task.assignee}</div>
                    <span>{task.assignee === 'ME' ? 'You' : task.assignee}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  <span className="label">Due Date</span>
                  <span className="value">{task.date}</span>
                </div>
                <div className="detail-item">
                  <Tag size={16} />
                  <span className="label">Labels</span>
                  <div className="value">
                    <span className="tag-pill">UI/UX</span>
                    <span className="tag-pill">Frontend</span>
                  </div>
                </div>
              </div>

              <div className="task-description-section">
                <h3>Description</h3>
                <div className="description-text">
                  This task involves architecting the core Kanban logic and ensuring smooth transitions between states.
                  Must support drag-and-drop and real-time status synchronization with the Spring Boot backend.
                </div>
              </div>

              <div className="task-tabs">
                <button className="active">Comments</button>
                <button>Activity</button>
                <button>Attachments</button>
              </div>

              <div className="comments-area">
                <div className="comment-list">
                  <div className="comment-item">
                    <div className="avatar-sm">JS</div>
                    <div className="comment-body">
                      <div className="comment-meta">
                        <strong>John Smith</strong> <span>2 hours ago</span>
                      </div>
                      <p>I've uploaded the updated API documentation for the task service.</p>
                    </div>
                  </div>
                </div>

                <div className="comment-input-wrapper">
                  <div className="avatar-sm">ME</div>
                  <div className="input-box">
                    <textarea placeholder="Add a comment..."></textarea>
                    <div className="input-footer">
                      <div className="formatting-btns">
                        <button>B</button>
                        <button>I</button>
                        <Paperclip size={16} />
                      </div>
                      <button className="send-btn"><Send size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskDrawer;
