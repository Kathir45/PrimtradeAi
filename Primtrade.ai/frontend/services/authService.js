import api from './api';

/**
 * Authentication service — all auth-related API calls.
 */
const authService = {
  /**
   * Register a new user.
   * @param {{ name: string, email: string, password: string }} data
   */
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.data.data?.token) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
    }
    return res.data;
  },

  /**
   * Login user.
   * @param {{ email: string, password: string }} data
   */
  login: async (data) => {
    const res = await api.post('/auth/login', data);
    if (res.data.data?.token) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
    }
    return res.data;
  },

  /**
   * Logout user — clears cookie + localStorage.
   */
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
