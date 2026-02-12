'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import InputField from '@/components/InputField';
import LoadingSpinner, { PageLoader } from '@/components/LoadingSpinner';
import { AnimatedButton, FadeIn } from '@/components/animations';
import { validateLoginForm, getApiError } from '@/utils/validation';
import { Mail, Lock, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const features = [
  { icon: Zap, text: 'Lightning fast task management' },
  { icon: Shield, text: 'Enterprise-grade security' },
  { icon: BarChart3, text: 'Real-time analytics dashboard' },
];

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await login(form);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error) {
      const message = getApiError(error);
      toast.error(message);
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <PageLoader />;

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <FadeIn delay={0.2}>
            <Link href="/" className="flex items-center gap-3 mb-12">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Primtrade<span className="text-primary-200">.ai</span>
              </span>
            </Link>
          </FadeIn>

          <FadeIn delay={0.3}>
            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
              Manage your work <br />
              <span className="text-primary-200">effortlessly.</span>
            </h2>
            <p className="text-primary-100/80 text-lg mb-10 max-w-md">
              The modern task management platform built for teams that care about productivity.
            </p>
          </FadeIn>

          <div className="space-y-4">
            {features.map((f, i) => (
              <FadeIn key={f.text} delay={0.4 + i * 0.1}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                    <f.icon className="h-4 w-4 text-primary-200" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">{f.text}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 bg-surface-50 dark:bg-dark-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Primtrade<span className="text-primary-500">.ai</span>
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-gray-500 dark:text-dark-700 text-sm mt-1.5">
              Sign in to your account to continue
            </p>
          </div>

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-5"
            >
              {errors.general}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email Address"
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              required
              autoComplete="email"
              icon={Mail}
            />

            <InputField
              label="Password"
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
              required
              autoComplete="current-password"
              icon={Lock}
            />

            <AnimatedButton
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </AnimatedButton>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-dark-700 mt-8">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
