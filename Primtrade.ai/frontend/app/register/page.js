'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import InputField from '@/components/InputField';
import LoadingSpinner, { PageLoader } from '@/components/LoadingSpinner';
import { AnimatedButton, FadeIn } from '@/components/animations';
import { validateRegisterForm, getApiError } from '@/utils/validation';
import { User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const benefits = [
  'Unlimited task creation & management',
  'Secure JWT-based authentication',
  'Real-time profile customization',
  'Advanced search & filtering',
];

export default function RegisterPage() {
  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
    const validationErrors = validateRegisterForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await register(form);
      toast.success('Account created successfully!');
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
        <div className="absolute inset-0">
          <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
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
              Start building <br />
              <span className="text-primary-200">something great.</span>
            </h2>
            <p className="text-primary-100/80 text-lg mb-10 max-w-md">
              Join thousands of productive teams already using Primtrade.ai.
            </p>
          </FadeIn>

          <div className="space-y-3.5">
            {benefits.map((b, i) => (
              <FadeIn key={b} delay={0.4 + i * 0.1}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary-300 flex-shrink-0" />
                  <span className="text-white/90 text-sm">{b}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Register Form */}
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
              Create your account
            </h1>
            <p className="text-gray-500 dark:text-dark-700 text-sm mt-1.5">
              Start managing your tasks today
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
              label="Full Name"
              id="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={errors.name}
              required
              autoComplete="name"
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
              autoComplete="email"
              icon={Mail}
            />

            <InputField
              label="Password"
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              error={errors.password}
              required
              autoComplete="new-password"
              icon={Lock}
            />

            <AnimatedButton
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </AnimatedButton>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-dark-700 mt-8">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
