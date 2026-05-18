import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Layout,
  AlertCircle
} from 'lucide-react';

import TaskCard from './TaskCard';
import TaskDrawer from '../TaskDetail/TaskDrawer';

import { taskService } from '../../../services/taskService';
import { projectService } from '../../../services/projectService';
import { userService } from '../../../services/userService';

import './KanbanBoard.css';

const KanbanBoard = ({ user }) => {

  const [columns, setColumns] = useState({
    TODO: {
      id: 'TODO',
      title: user?.role === 'MANAGER'
        ? 'Assigned Tasks'
        : 'To Do',
      tasks: []
    },

    IN_PROGRESS: {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      tasks: []
    },

    TESTING: {
      id: 'TESTING',
      title: 'Testing',
      tasks: []
    },

    COMPLETED: {
      id: 'COMPLETED',
      title: 'Completed',
      tasks: []
    }
  });

  const [selectedTask, setSelectedTask] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [projects, setProjects] = useState([]);

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [user?.id]);

  const fetchTasks = async () => {

    try {

      setLoading(true);

      let tasksPromise;

      if (user?.role === 'EMPLOYEE') {

        if (user.id) {

          tasksPromise =
            taskService.getTasksByEmployee(user.id);

        } else {

          tasksPromise =
            taskService.getAllTasks().then(tasks =>
              tasks.filter(
                t =>
                  t.assignedEmployeeName?.toLowerCase()
                  === user.username?.toLowerCase()
              )
            );
        }

      } else {

        tasksPromise = taskService.getAllTasks();
      }

      const results = await Promise.allSettled([

        tasksPromise,

        user?.role !== 'EMPLOYEE'
          ? projectService.getManagerProjects()
          : Promise.resolve([]),

        user?.role !== 'EMPLOYEE'
          ? userService.getAllUsers()
          : Promise.resolve([])

      ]);

      const tasks =
        results[0].status === 'fulfilled'
          ? results[0].value
          : [];

      const myProjects =
        results[1].status === 'fulfilled'
          ? results[1].value
          : [];

      const allUsers =
        results[2].status === 'fulfilled'
          ? results[2].value
          : [];

      let finalTasks = [...tasks];

      const categorized = {

        TODO: {
          id: 'TODO',
          title:
            user?.role === 'MANAGER'
              ? 'Assigned Tasks'
              : 'To Do',
          tasks: []
        },

        IN_PROGRESS: {
          id: 'IN_PROGRESS',
          title: 'In Progress',
          tasks: []
        },

        TESTING: {
          id: 'TESTING',
          title: 'Testing',
          tasks: []
        },

        COMPLETED: {
          id: 'COMPLETED',
          title: 'Completed',
          tasks: []
        }
      };

      if (Array.isArray(finalTasks)) {

        finalTasks.forEach(task => {

          let statusKey =
            task.status
              ? task.status
                .toString()
                .toUpperCase()
                .replace(/\s+/g, '_')
              : 'TODO';

          if (!categorized[statusKey]) {
            statusKey = 'TODO';
          }

          categorized[statusKey].tasks.push(task);
        });
      }

      setColumns(categorized);

      setProjects(myProjects || []);

      setEmployees(
        allUsers.filter(
          u => u.role?.toUpperCase() === 'EMPLOYEE'
        )
      );

    } catch (err) {

      console.error(
        'KANBAN FETCH ERROR:',
        err
      );

      alert(
        'Failed to load tasks'
      );

    } finally {

      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {

    if (
      !taskData.title ||
      !taskData.projectId ||
      !taskData.employeeId
    ) {

      alert('Please fill required fields');

      return;
    }

    try {

      const requestPayload = {

        title: taskData.title,

        description:
          taskData.description || '',

        priority:
          (
            taskData.priority ||
            'MEDIUM'
          ).toUpperCase(),

        employeeId:
          Number(taskData.employeeId),

        projectId:
          Number(taskData.projectId),

        dueDate:
          taskData.dueDate || null,

        estimatedHours:
          taskData.estimatedHours
            ? Number(taskData.estimatedHours)
            : null
      };

      console.log(
        'TASK PAYLOAD:',
        requestPayload
      );

      await taskService.createTask(
        requestPayload
      );

      alert(
        'Task created successfully'
      );

      setIsModalOpen(false);

      fetchTasks();

    } catch (err) {

      console.error(
        'TASK CREATE ERROR:',
        err
      );

      alert(
        err?.message ||
        'Task creation failed'
      );
    }
  };

  const handleTaskClick = (task) => {

    setSelectedTask(task);

    setIsDrawerOpen(true);
  };

  const onDragStart = (taskId) => {

    setDraggedTaskId(taskId);
  };

  const onDrop = async (targetStatus) => {

    if (!draggedTaskId) return;

    try {

      const newColumns = { ...columns };

      let taskToMove = null;

      Object.values(newColumns).forEach(col => {

        const taskIndex =
          col.tasks.findIndex(
            t => t.id === draggedTaskId
          );

        if (taskIndex !== -1) {

          taskToMove = {
            ...col.tasks[taskIndex]
          };

          col.tasks.splice(taskIndex, 1);
        }
      });

      if (taskToMove) {

        taskToMove.status =
          targetStatus.toUpperCase();

        newColumns[targetStatus]
          .tasks.push(taskToMove);

        setColumns({ ...newColumns });

        await taskService.updateTaskStatus(
          taskToMove.id,
          targetStatus.toUpperCase()
        );
      }

    } catch (err) {

      fetchTasks();
    }

    setDraggedTaskId(null);
  };

  const handleDeleteTask = async (
    e,
    taskId
  ) => {

    e.stopPropagation();

    if (
      !window.confirm(
        'Delete this task?'
      )
    ) return;

    try {

      await taskService.deleteTask(taskId);

      fetchTasks();

    } catch (err) {

      alert(
        'Delete failed'
      );
    }
  };

  return (

    <div className="kanban-container">

      <header className="kanban-header">

        <div className="project-info">

          <div className="project-icon">
            <Layout size={20} />
          </div>

          <div>
            <h1>
              Software CRM
            </h1>

            <p>
              Task Management
            </p>
          </div>

        </div>

        <div className="kanban-actions">

          <div
            className="debug-sync-status"
            style={{
              fontSize: '12px',
              color: '#64748b',
              marginRight: '15px',
              textAlign: 'right'
            }}
          >
            <div>
              Tasks:
              {
                Object.values(columns)
                  .reduce(
                    (acc, col) =>
                      acc + col.tasks.length,
                    0
                  )
              }
            </div>

            <div>
              Projects:
              {projects.length}
            </div>

            <div>
              Users:
              {employees.length}
            </div>

          </div>

          {
            user?.role !== 'EMPLOYEE' && (

              <button
                className="primary-btn"
                onClick={() =>
                  setIsModalOpen(true)
                }
                style={{
                  background: '#1e3a8a',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >

                <Plus size={18} />

                <span>
                  Create Task
                </span>

              </button>
            )
          }

        </div>

      </header>

      {
        loading ? (

          <div className="kanban-loading">

            <div className="spinner"></div>

            <p>
              Loading Tasks...
            </p>

          </div>

        ) : Object.values(columns)
          .every(
            col => col.tasks.length === 0
          ) ? (

          <div
            className="kanban-empty-state"
            style={{
              padding: '100px',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: '20px',
              margin: '20px'
            }}
          >

            <AlertCircle
              size={48}
              color="#94a3b8"
              style={{
                marginBottom: '16px'
              }}
            />

            <h2>
              No Tasks Found
            </h2>

            <p>
              No tasks available
            </p>

          </div>

        ) : (

          <div className="kanban-board">

            {
              Object.values(columns).map(
                column => (

                  <div
                    key={column.id}
                    className="kanban-column"
                    onDragOver={e =>
                      e.preventDefault()
                    }
                    onDrop={() =>
                      onDrop(column.id)
                    }
                  >

                    <div className="column-header">

                      <h3>

                        {column.title}

                        <span className="count">
                          {column.tasks.length}
                        </span>

                      </h3>

                    </div>

                    <div className="task-list">

                      <AnimatePresence>

                        {
                          column.tasks.map(task => (

                            <TaskCard
                              key={task.id}
                              task={task}
                              onClick={() =>
                                handleTaskClick(task)
                              }
                              onDragStart={() =>
                                onDragStart(task.id)
                              }
                              onDelete={e =>
                                handleDeleteTask(
                                  e,
                                  task.id
                                )
                              }
                              showDelete={
                                user?.role === 'MANAGER'
                              }
                            />
                          ))
                        }

                      </AnimatePresence>

                    </div>

                  </div>
                ))
            }

          </div>
        )
      }

      <TaskDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() =>
          setIsDrawerOpen(false)
        }
      />

      <AnimatePresence>

        {
          isModalOpen && (

            <TaskCreateModal
              onClose={() =>
                setIsModalOpen(false)
              }
              onSubmit={handleCreateTask}
              projects={projects}
              employees={employees}
            />
          )
        }

      </AnimatePresence>

    </div>
  );
};

const TaskCreateModal = ({
  onClose,
  onSubmit,
  projects,
  employees
}) => {

  const [formData, setFormData] =
    useState({

      title: '',

      description: '',

      priority: 'MEDIUM',

      projectId: '',

      employeeId: '',

      dueDate: '',

      estimatedHours: ''
    });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid =
    formData.title &&
    formData.projectId &&
    formData.employeeId;

  return (

    <div
      className="modal-overlay"
      style={{
        background:
          'rgba(0,0,0,0.6)',
        zIndex: 9999
      }}
    >

      <motion.div
        className="modal-content side-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        style={{
          background: 'white',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          width: '480px'
        }}
      >

        <div
          className="modal-header"
          style={{
            padding: '24px',
            borderBottom:
              '1px solid #e2e8f0',
            display: 'flex',
            justifyContent:
              'space-between'
          }}
        >

          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '800'
            }}
          >
            Create New Task
          </h2>

          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer'
            }}
          >
            X
          </button>

        </div>

        <div
          className="modal-body"
          style={{
            padding: '24px',
            flex: 1,
            overflowY: 'auto'
          }}
        >

          <div
            style={{
              marginBottom: '20px'
            }}
          >

            <label
              style={{
                display: 'block',
                fontWeight: '700',
                marginBottom: '8px'
              }}
            >
              Task Title *
            </label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Task name"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border:
                  '1px solid #cbd5e1'
              }}
            />

          </div>

          <div
            style={{
              marginBottom: '20px'
            }}
          >

            <label
              style={{
                display: 'block',
                fontWeight: '700',
                marginBottom: '8px'
              }}
            >
              Project *
            </label>

            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border:
                  '1px solid #cbd5e1'
              }}
            >

              <option value="">
                -- Select Project --
              </option>

              {
                projects.map(p => (

                  <option
                    key={p.id}
                    value={p.id}
                  >
                    {p.name}
                  </option>
                ))
              }

            </select>

          </div>

          <div
            style={{
              marginBottom: '20px'
            }}
          >

            <label
              style={{
                display: 'block',
                fontWeight: '700',
                marginBottom: '8px'
              }}
            >
              Assignee *
            </label>

            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border:
                  '1px solid #cbd5e1'
              }}
            >

              <option value="">
                -- Select Employee --
              </option>

              {
                employees.map(e => (

                  <option
                    key={e.id}
                    value={e.id}
                  >
                    {
                      e.fullName ||
                      e.username
                    }
                  </option>
                ))
              }

            </select>

          </div>

          <div
            style={{
              marginBottom: '20px'
            }}
          >

            <label
              style={{
                display: 'block',
                fontWeight: '700',
                marginBottom: '8px'
              }}
            >
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border:
                  '1px solid #cbd5e1'
              }}
            />

          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: '16px',
              marginBottom: '20px'
            }}
          >

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border:
                  '1px solid #cbd5e1'
              }}
            >

              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>

            </select>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border:
                  '1px solid #cbd5e1'
              }}
            />

          </div>

        </div>

        <div
          className="modal-footer"
          style={{
            padding: '24px',
            borderTop:
              '1px solid #e2e8f0',
            display: 'flex',
            gap: '12px'
          }}
        >

          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border:
                '1px solid #e2e8f0',
              fontWeight: '700'
            }}
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSubmit(formData)
            }
            disabled={!isFormValid}
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background:
                isFormValid
                  ? '#1e3a8a'
                  : '#94a3b8',
              color: 'white',
              fontWeight: '700',
              cursor:
                isFormValid
                  ? 'pointer'
                  : 'not-allowed'
            }}
          >
            Create Task
          </button>

        </div>

      </motion.div>

    </div>
  );
};

export default KanbanBoard;