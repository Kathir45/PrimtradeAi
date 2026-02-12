'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import userService from '@/services/userService';
import InputField from '@/components/InputField';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PageTransition, AnimatedButton, FadeIn } from '@/components/animations';
import { validateName, validateEmail, getApiError } from '@/utils/validation';
import { User, Mail, Save, Calendar, Hash, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (saved) setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    if (nameErr) validationErrors.name = nameErr;
    if (emailErr) validationErrors.email = emailErr;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Only send changed fields
    const updates = {};
    if (form.name !== user.name) updates.name = form.name;
    if (form.email !== user.email) updates.email = form.email;

    if (Object.keys(updates).length === 0) {
      toast('No changes to save', { icon: 'ℹ️' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await userService.updateProfile(updates);
      updateUser(res.data.user);
      toast.success('Profile updated successfully');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      const message = getApiError(error);
      toast.error(message);
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-gray-500 dark:text-dark-400 mt-1">
          Manage your account information
        </p>
      </div>

      <div className="max-w-lg">
        {/* Profile Card */}
        <FadeIn delay={0.1}>
          <div className="card dark:bg-dark-800 dark:border-dark-700">
            {/* Avatar Section */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-dark-700">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="text-white font-bold text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-dark-400">{user?.email}</p>
              </div>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-4"
                >
                  {errors.general}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Banner */}
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Profile saved successfully!
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Full Name"
                id="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                error={errors.name}
                required
                icon={User}
              />

              <InputField
                label="Email Address"
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={errors.email}
                required
                icon={Mail}
              />

              <div className="pt-2">
                <AnimatedButton
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Saving...' : 'Save Changes'}
                </AnimatedButton>
              </div>
            </form>
          </div>
        </FadeIn>

        {/* Account Info */}
        <FadeIn delay={0.25}>
          <div className="card dark:bg-dark-800 dark:border-dark-700 mt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Account Information
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-dark-700/50">
                <dt className="text-gray-500 dark:text-dark-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member since
                </dt>
                <dd className="text-gray-900 dark:text-white font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '—'}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-dark-700/50">
                <dt className="text-gray-500 dark:text-dark-400 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  User ID
                </dt>
                <dd className="text-gray-900 dark:text-white font-mono text-xs">
                  {user?._id || '—'}
                </dd>
              </div>
            </dl>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
