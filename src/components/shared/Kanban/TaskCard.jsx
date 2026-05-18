import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Paperclip, 
  MessageSquare, 
  MoreHorizontal,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Trash2
} from 'lucide-react';

const TaskCard = ({ task, onClick, onDragStart, onDelete, showDelete }) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return <ChevronUp className="text-red-500" size={16} />;
      case 'Medium': return <ChevronUp className="text-orange-500" size={16} />;
      case 'Low': return <ChevronUp className="text-green-500" size={16} />;
      default: return null;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'STORY': return '#6366f1';
      case 'TASK': return '#4f46e5';
      case 'BUG': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  return (
    <motion.div 
      className="task-card"
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      draggable={true}
      onDragStart={onDragStart}
    >
      <div className="task-card-header">
        <div className="task-type" style={{ backgroundColor: getTypeColor(task.type) }}></div>
        <div className="header-meta">
          <span className="task-id">#{task.id || task.taskId}</span>
          {task.projectName && <span className="project-tag">{task.projectName}</span>}
        </div>
        <div className="card-actions-group">
          {showDelete && (
            <button 
              className="card-delete-btn" 
              onClick={onDelete}
              style={{ color: '#ef4444', marginRight: '8px', opacity: 0.7 }}
            >
              <Trash2 size={14} />
            </button>
          )}
          <button className="card-more-btn"><MoreHorizontal size={14} /></button>
        </div>
      </div>

      <h4 className="task-title">{task.title}</h4>

      {(task.progress > 0 || task.progressPercentage > 0) && (
        <div className="task-progress-mini">
          <div className="progress-bar-bg">
            <div className="progress-fill" style={{ width: `${task.progress || task.progressPercentage}%` }}></div>
          </div>
        </div>
      )}

      <div className="task-card-footer">
        <div className="footer-left">
          {getPriorityIcon(task.priority)}
          <div className="task-meta-item">
            <Clock size={12} />
            <span>{task.date || task.dueDate || 'No date'}</span>
          </div>
        </div>
        
        <div className="footer-right">
          {(task.files || task.attachmentCount) > 0 && (
            <div className="task-meta-item">
              <Paperclip size={12} />
              <span>{task.files || task.attachmentCount}</span>
            </div>
          )}
          {(task.comments || task.commentCount) > 0 && (
            <div className="task-meta-item">
              <MessageSquare size={12} />
              <span>{task.comments || task.commentCount}</span>
            </div>
          )}
          <div className="task-assignee-avatar">
            {task.assignee || task.assignedEmployeeName?.substring(0, 2).toUpperCase() || '??'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
