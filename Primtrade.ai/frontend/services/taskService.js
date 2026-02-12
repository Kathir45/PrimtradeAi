import api from './api';

/**
 * Task service — CRUD + search/filter API calls.
 */
const taskService = {
  /**
   * Create a new task.
   * @param {{ title: string, description?: string, status?: string }} data
   */
  create: async (data) => {
    const res = await api.post('/tasks', data);
    return res.data;
  },

  /**
   * Get all tasks with optional search & filter.
   * @param {{ search?: string, status?: string, page?: number, limit?: number }} params
   */
  getAll: async (params = {}) => {
    const res = await api.get('/tasks', { params });
    return res.data;
  },

  /**
   * Update a task.
   * @param {string} id - Task ID
   * @param {{ title?: string, description?: string, status?: string }} data
   */
  update: async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },

  /**
   * Delete a task.
   * @param {string} id - Task ID
   */
  delete: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};

export default taskService;
