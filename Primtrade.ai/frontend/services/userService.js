import api from './api';

/**
 * User service — profile-related API calls.
 */
const userService = {
  /**
   * Get current logged-in user profile.
   */
  getMe: async () => {
    const res = await api.get('/user/me');
    return res.data;
  },

  /**
   * Update user profile.
   * @param {{ name?: string, email?: string }} data
   */
  updateProfile: async (data) => {
    const res = await api.put('/user/update', data);
    if (res.data.data?.user) {
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
    }
    return res.data;
  },
};

export default userService;
