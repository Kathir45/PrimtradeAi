'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { AnimatedButton } from '@/components/animations';
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  BarChart3,
  Sun,
  Moon,
  Sparkles,
  Lock,
  Search,
  Layers,
  TrendingUp,
  Clock,
  Users,
  Globe,
  Check,
} from 'lucide-react';

// ─── Scroll-Reveal Wrapper ───────────────────────────────────────────────────

function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const dirMap = {
    up: { hidden: { y: 40 }, visible: { y: 0 } },
    down: { hidden: { y: -40 }, visible: { y: 0 } },
    left: { hidden: { x: 40 }, visible: { x: 0 } },
    right: { hidden: { x: -40 }, visible: { x: 0 } },
    none: { hidden: {}, visible: {} },
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...dirMap[direction].hidden }}
      animate={isInView ? { opacity: 1, ...dirMap[direction].visible } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Floating Mock Dashboard Card ────────────────────────────────────────────

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mt-16 sm:mt-20 max-w-4xl mx-auto [perspective:1200px]"
    >
      {/* Main card */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 dark:border-white/5 shadow-[0_20px_80px_-15px_rgba(99,102,241,0.2)] dark:shadow-[0_20px_80px_-15px_rgba(99,102,241,0.15)]">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/20 via-transparent to-transparent dark:from-white/10 pointer-events-none z-10" />

        {/* Dashboard mock */}
        <div className="bg-white/90 dark:bg-dark-100/90 backdrop-blur-xl p-4 sm:p-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="h-5 w-48 bg-gray-100 dark:bg-dark-300 rounded-lg" />
            <div className="flex gap-2">
              <div className="h-6 w-6 bg-gray-100 dark:bg-dark-300 rounded-md" />
              <div className="h-6 w-6 bg-gray-100 dark:bg-dark-300 rounded-md" />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total Tasks', value: '128', icon: Layers, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
              { label: 'Completed', value: '96', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
              { label: 'Pending', value: '32', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
              { label: 'Rate', value: '75%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
                className="bg-white dark:bg-dark-200 rounded-xl p-3 border border-gray-100 dark:border-dark-300"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-7 h-7 ${s.bg} rounded-lg flex items-center justify-center`}>
                    <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-dark-600">{s.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Task rows */}
          <div className="space-y-2">
            {[
              { title: 'Design system overhaul', status: 'completed' },
              { title: 'API integration testing', status: 'pending' },
              { title: 'Deploy to production', status: 'pending' },
            ].map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + i * 0.08, duration: 0.3 }}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50/80 dark:bg-dark-200/80 border border-gray-100/50 dark:border-dark-300/50"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${t.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-dark-500'}`}>
                    {t.status === 'completed' && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <span className={`text-xs ${t.status === 'completed' ? 'text-gray-400 dark:text-dark-600 line-through' : 'text-gray-700 dark:text-dark-800'}`}>{t.title}</span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${t.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                  {t.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating badge - left */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-4 sm:-left-10 top-12 hidden sm:block"
      >
        <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-elevation-4 dark:shadow-none border border-gray-100/80 dark:border-dark-400 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-dark-600">Productivity</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">+27%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating badge - right */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -right-4 sm:-right-8 bottom-16 hidden sm:block"
      >
        <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-elevation-4 dark:shadow-none border border-gray-100/80 dark:border-dark-400 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-dark-600">Active users</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">2,847</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme() || {};
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  const features = [
    {
      icon: Shield,
      title: 'Enterprise-Grade Security',
      desc: 'JWT tokens, bcrypt hashing, httpOnly cookies, and CORS protection by default.',
      gradient: 'from-blue-500 to-cyan-400',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      desc: 'Instant task statistics, completion tracking, and progress monitoring at a glance.',
      gradient: 'from-violet-500 to-purple-400',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      desc: 'Optimized Express API with MongoDB indexing delivers sub-50ms response times.',
      gradient: 'from-amber-500 to-orange-400',
    },
    {
      icon: Search,
      title: 'Smart Search',
      desc: 'Full-text search with status filtering, pagination, and instant debounced results.',
      gradient: 'from-emerald-500 to-teal-400',
    },
    {
      icon: Globe,
      title: 'Modern Stack',
      desc: 'Next.js 14 App Router, Tailwind CSS, Framer Motion — built with the latest tools.',
      gradient: 'from-pink-500 to-rose-400',
    },
    {
      icon: Layers,
      title: 'Clean Architecture',
      desc: 'Separation of concerns with controllers, services, middleware, and proper error handling.',
      gradient: 'from-indigo-500 to-blue-400',
    },
  ];

  const whyUs = [
    {
      icon: Lock,
      title: 'Secure by Design',
      desc: 'Every endpoint is protected. Your data stays safe with industry-standard encryption and auth.',
    },
    {
      icon: CheckCircle,
      title: 'Production Ready',
      desc: 'Not a toy project — built with real error handling, validation, and scalable patterns.',
    },
    {
      icon: Sparkles,
      title: 'Beautiful UI',
      desc: 'Crafted with premium components, motion design, dark mode, and mobile-first responsiveness.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-0 transition-colors duration-500 overflow-x-hidden">

      {/* ─── Global Background ──────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.08),transparent)]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Animated orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-primary-500/[0.07] dark:bg-primary-500/[0.05] rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-purple-500/[0.06] dark:bg-purple-500/[0.04] rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] bg-cyan-500/[0.05] dark:bg-cyan-500/[0.03] rounded-full blur-[100px]"
        />
      </div>

      {/* ─── Navbar ─────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/40 dark:border-white/[0.06]"
      >
        <div className="absolute inset-0 bg-white/60 dark:bg-dark-0/60 backdrop-blur-2xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/30 transition-shadow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                Primtrade<span className="text-primary-600 dark:text-primary-400">.ai</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-gray-100/80 dark:hover:bg-white/[0.06] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-[18px] w-[18px] text-amber-400" />
                ) : (
                  <Moon className="h-[18px] w-[18px] text-gray-500" />
                )}
              </button>
              {user ? (
                <Link href="/dashboard">
                  <AnimatedButton className="btn-primary text-sm">
                    Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                  </AnimatedButton>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-dark-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link href="/register">
                    <AnimatedButton className="btn-primary text-sm shadow-lg shadow-primary-500/20">
                      Get Started <ArrowRight className="ml-1 h-4 w-4" />
                    </AnimatedButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Section ───────────────────────────────────────────────── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16"
      >
        {/* Radial glow behind headline */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary-500/[0.08] dark:bg-primary-500/[0.06] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-gray-200/60 dark:border-white/10 text-gray-700 dark:text-dark-800 px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
              </span>
              Now in Public Beta
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.12 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6"
          >
            The modern way to
            <br />
            <span className="bg-gradient-to-r from-primary-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              manage tasks
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.24 }}
            className="text-lg sm:text-xl text-gray-500 dark:text-dark-700 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            A beautifully designed, production-ready task platform with secure
            authentication, real-time analytics, and a developer-first API.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.36 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl shadow-[0_8px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.4)] transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-dark-0"
              >
                Start for Free
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-dark-800 bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-2xl hover:bg-white dark:hover:bg-white/[0.1] transition-all shadow-sm"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>

          {/* Trusted by */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-14"
          >
            {[
              { icon: Lock, text: 'JWT Auth' },
              { icon: Search, text: 'Smart Search' },
              { icon: Layers, text: 'REST API' },
              { icon: BarChart3, text: 'Analytics' },
            ].map((h) => (
              <div
                key={h.text}
                className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 dark:text-dark-600"
              >
                <h.icon className="h-3.5 w-3.5" />
                <span>{h.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <DashboardPreview />

        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-dark-0 to-transparent pointer-events-none" />
      </motion.section>

      {/* ─── Features Section ───────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <Reveal className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary-500 dark:text-primary-400 mb-3">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              Everything you need,{' '}
              <span className="bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">
                nothing you don&apos;t
              </span>
            </h2>
            <p className="text-gray-500 dark:text-dark-700 text-lg max-w-2xl mx-auto">
              Built with the best practices of modern SaaS platforms. Ship fast, stay secure, scale effortlessly.
            </p>
          </Reveal>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="group relative h-full rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-lg border border-gray-200/60 dark:border-white/[0.06] p-6 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)] overflow-hidden"
                >
                  {/* Gradient border glow on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5 dark:from-primary-500/[0.03] dark:to-purple-500/[0.03]" />

                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-dark-700 leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ──────────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-32">
        {/* Subtle divider gradient */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary-500 dark:text-primary-400 mb-3">
              Why Primtrade.ai
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Built different
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whyUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.12}>
                <div className="text-center group">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/10 to-violet-500/10 dark:from-primary-500/[0.08] dark:to-violet-500/[0.08] flex items-center justify-center mb-5 border border-primary-200/30 dark:border-primary-500/10"
                  >
                    <item.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-dark-700 leading-relaxed max-w-xs mx-auto">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─────────────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

        <Reveal>
          <div className="relative max-w-4xl mx-auto">
            {/* Card */}
            <div className="relative rounded-3xl overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-violet-600 to-purple-700" />
              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]" />
              {/* Glow orbs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-300/20 rounded-full blur-[60px]" />

              <div className="relative px-8 sm:px-16 py-16 sm:py-20 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                  Ready to get started?
                </h2>
                <p className="text-base sm:text-lg text-white/70 mb-10 max-w-lg mx-auto">
                  Join thousands of users managing their work with Primtrade.ai.
                  Free forever to start.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/register">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-primary-700 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.2)] transition-shadow"
                    >
                      Start for Free
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  </Link>
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white/90 border border-white/20 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer className="relative py-10 text-center">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Primtrade<span className="text-primary-500">.ai</span>
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-dark-600">
          &copy; {new Date().getFullYear()} Primtrade.ai — Built with Next.js, Express &amp; MongoDB
        </p>
      </footer>
    </div>
  );
}
