'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import taskService from '@/services/taskService';
import LoadingSpinner, { Skeleton } from '@/components/LoadingSpinner';
import { PageTransition, ModalOverlay, AnimatedButton, StaggerList, StaggerItem } from '@/components/animations';
import { getApiError } from '@/utils/validation';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Check,
  X,
  Filter,
  ListTodo,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Task Form Modal ──────────────────────────────────────────────────────────

function TaskModal({ task, onClose, onSave }) {
  const isEdit = !!task;
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        const res = await taskService.update(task._id, form);
        onSave(res.data.task, 'updated');
      } else {
        const res = await taskService.create(form);
        onSave(res.data.task, 'created');
      }
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-[720px] max-w-[92vw] border border-gray-200 dark:border-dark-600 dark:shadow-none dark:shadow-dark-glow">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-dark-700 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-dark-700/40 dark:to-transparent">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-dark-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2 font-medium"
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-semibold text-gray-800 dark:text-dark-100 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="What needs to be done?"
              className="input-field dark:bg-dark-700 dark:text-dark-50"
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="task-desc"
              className="block text-sm font-semibold text-gray-800 dark:text-dark-100 mb-2"
            >
              Description
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Add more details..."
              className="input-field resize-none dark:bg-dark-700 dark:text-dark-50"
            />
          </div>

          <div>
            <label
              htmlFor="task-status"
              className="block text-sm font-semibold text-gray-800 dark:text-dark-100 mb-2"
            >
              Status
            </label>
            <select
              id="task-status"
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
              className="input-field dark:bg-dark-700 dark:text-dark-50"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-sm dark:bg-dark-700 dark:text-dark-100 dark:border-dark-600"
            >
              Cancel
            </button>
            <AnimatedButton
              type="submit"
              disabled={loading}
              className="btn-primary text-sm"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {isEdit ? 'Update Task' : 'Create Task'}
            </AnimatedButton>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteModal({ task, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await taskService.delete(task._id);
      onConfirm(task._id);
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-200 dark:border-dark-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Task
            </h2>
            <p className="text-sm text-gray-500 dark:text-dark-400">
              This action cannot be undone.
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-dark-300 mb-6 bg-gray-50 dark:bg-dark-700/50 px-3 py-2 rounded-lg">
          &quot;{task.title}&quot;
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-secondary text-sm">
            Cancel
          </button>
          <AnimatedButton
            onClick={handleDelete}
            disabled={loading}
            className="btn-danger text-sm"
          >
            {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Trash2 className="h-4 w-4 mr-1.5" />}
            Delete
          </AnimatedButton>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const res = await taskService.update(task._id, { status: newStatus });
      onToggle(res.data.task);
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setToggling(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      className="card dark:bg-dark-800 dark:border-dark-700 hover:shadow-elevation-2 dark:hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-start gap-3">
        {/* Toggle Status */}
        <motion.button
          onClick={handleToggle}
          disabled={toggling}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
            ${
              task.status === 'completed'
                ? 'bg-emerald-500 border-emerald-500 dark:bg-emerald-500 dark:border-emerald-500'
                : 'border-gray-300 dark:border-dark-500 hover:border-primary-500 dark:hover:border-primary-400'
            }`}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
        >
          <AnimatePresence>
            {task.status === 'completed' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-medium transition-all duration-200 ${
              task.status === 'completed'
                ? 'text-gray-400 dark:text-dark-500 line-through'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-gray-500 dark:text-dark-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                task.status === 'completed'
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
              }`}
            >
              {task.status}
            </span>
            <span className="text-xs text-gray-400 dark:text-dark-500">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-400 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Edit task"
            whileTap={{ scale: 0.9 }}
          >
            <Edit3 className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 dark:text-dark-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete task"
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Task Skeleton ────────────────────────────────────────────────────────────

function TaskSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card dark:bg-dark-800 dark:border-dark-700">
          <div className="flex items-start gap-3">
            <Skeleton className="w-5 h-5 rounded-md mt-0.5" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-3">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Tasks Page ──────────────────────────────────────────────────────────

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      params.page = pagination.page;

      const res = await taskService.getAll(params);
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
    } catch {
      // Errors handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, pagination.page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleTaskSaved = (task, action) => {
    if (action === 'created') {
      toast.success('Task created!');
    } else {
      toast.success('Task updated!');
    }
    setShowCreateModal(false);
    setEditTask(null);
    fetchTasks();
  };

  const handleTaskDeleted = (taskId) => {
    toast.success('Task deleted!');
    setDeleteTask(null);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
  };

  const handleToggle = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Tasks
          </h1>
          <p className="text-gray-500 dark:text-dark-400 mt-1">
            {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <AnimatedButton
          onClick={() => setShowCreateModal(true)}
          className="btn-primary text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </AnimatedButton>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-dark-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks by title..."
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-dark-500" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="input-field pl-10 pr-8 min-w-[160px]"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <TaskSkeleton />
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card dark:bg-dark-800 dark:border-dark-700 text-center py-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <ListTodo className="h-14 w-14 text-gray-300 dark:text-dark-600 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {search || statusFilter ? 'No tasks found' : 'No tasks yet'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-dark-400 mb-5">
            {search || statusFilter
              ? 'Try adjusting your search or filter'
              : 'Create your first task to get started'}
          </p>
          {!search && !statusFilter && (
            <AnimatedButton
              onClick={() => setShowCreateModal(true)}
              className="btn-primary text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </AnimatedButton>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setEditTask}
                onDelete={setDeleteTask}
                onToggle={handleToggle}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mt-6"
        >
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={pagination.page <= 1}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-dark-400 px-3">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page >= pagination.pages}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <TaskModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleTaskSaved}
          />
        )}

        {editTask && (
          <TaskModal
            task={editTask}
            onClose={() => setEditTask(null)}
            onSave={handleTaskSaved}
          />
        )}

        {deleteTask && (
          <DeleteModal
            task={deleteTask}
            onClose={() => setDeleteTask(null)}
            onConfirm={handleTaskDeleted}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
