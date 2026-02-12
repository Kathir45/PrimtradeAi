'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import taskService from '@/services/taskService';
import { Skeleton } from '@/components/LoadingSpinner';
import { PageTransition } from '@/components/animations';
import {
  CheckCircle2,
  Clock4,
  ListTodo,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Calendar,
  Sparkles,
  Zap,
  Target,
} from 'lucide-react';
import Link from 'next/link';

/* ── Animated counter ─────────────────────────────────────── */
function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const num = typeof value === 'number' ? value : parseInt(value) || 0;
    if (num === 0) { setDisplay(0); return; }
    let start = 0;
    const step = Math.max(1, Math.floor(num / 30));
    const interval = setInterval(() => {
      start += step;
      if (start >= num) { setDisplay(num); clearInterval(interval); }
      else setDisplay(start);
    }, 25);
    return () => clearInterval(interval);
  }, [value, inView]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── Radial progress ring ─────────────────────────────────── */
function RadialProgress({ percent = 0, size = 140, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          className="stroke-gray-100 dark:stroke-white/[0.06]" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none"
          strokeWidth={stroke} strokeLinecap="round"
          className="stroke-indigo-500"
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: circ - (circ * percent) / 100 } : {}}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          style={{ strokeDasharray: circ }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {inView ? <AnimatedNumber value={Math.round(percent)} suffix="%" /> : '0%'}
        </span>
        <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">completed</span>
      </div>
    </div>
  );
}

/* ── Skeleton loaders ─────────────────────────────────────── */
function StatSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200/60 dark:border-white/[0.06] bg-white dark:bg-[#16161d] p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-10" />
        </div>
      </div>
    </div>
  );
}
function TasksSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200/60 dark:border-white/[0.06] bg-white dark:bg-[#16161d] p-5">
      <Skeleton className="h-5 w-28 mb-5" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-4 flex-1 max-w-[220px]" />
            <Skeleton className="h-5 w-16 rounded-full ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, completedRes, pendingRes] = await Promise.all([
          taskService.getAll({ limit: 5 }),
          taskService.getAll({ status: 'completed', limit: 1 }),
          taskService.getAll({ status: 'pending', limit: 1 }),
        ]);
        setStats({
          total: allRes.data.pagination.total,
          completed: completedRes.data.pagination.total,
          pending: pendingRes.data.pagination.total,
        });
        setRecentTasks(allRes.data.tasks);
      } catch {
        // handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completionRate = stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statCards = [
    { label: 'Total Tasks', value: stats?.total || 0, icon: ListTodo,
      gradient: 'from-blue-500 to-cyan-400', bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
    { label: 'Completed', value: stats?.completed || 0, icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Pending', value: stats?.pending || 0, icon: Clock4,
      gradient: 'from-amber-500 to-orange-400', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
    { label: 'Rate', value: completionRate, icon: TrendingUp, suffix: '%',
      gradient: 'from-violet-500 to-purple-400', bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400' },
  ];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diff = Math.floor((now - date) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* ─── Row 1: Header ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {getGreeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
              Here&apos;s what&apos;s happening with your tasks today.
            </p>
          </div>
          <Link href="/dashboard/tasks"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700
              shadow-sm shadow-indigo-500/20 transition-all duration-200 hover:shadow-md hover:shadow-indigo-500/25 w-fit">
            <Plus className="h-4 w-4" /> New Task
          </Link>
        </div>

        {/* ─── Row 2: Stat cards ─────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.map((s) => (
              <motion.div key={s.label} variants={item}
                className="group relative rounded-xl border border-gray-200/60 dark:border-white/[0.06]
                  bg-white dark:bg-[#16161d] p-4 overflow-hidden
                  hover:border-gray-300 dark:hover:border-white/[0.1]
                  hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20
                  transition-all duration-300 cursor-default">
                {/* subtle gradient accent top */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.bg} transition-transform duration-300 group-hover:scale-105`}>
                    <s.icon className={`h-5 w-5 ${s.text}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">{s.label}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">
                      <AnimatedNumber value={s.value} suffix={s.suffix || ''} />
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ─── Row 3: Tasks + Progress widget ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Recent tasks — col 1-8 */}
          {loading ? (
            <div className="lg:col-span-8"><TasksSkeleton /></div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-8 rounded-xl border border-gray-200/60 dark:border-white/[0.06]
                bg-white dark:bg-[#16161d] overflow-hidden">
              {/* card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.04]">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
                <Link href="/dashboard/tasks"
                  className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              {recentTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-3">
                    <ListTodo className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">No tasks yet</p>
                  <Link href="/dashboard/tasks"
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                    Create your first task &rarr;
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                  {recentTasks.map((task, i) => (
                    <motion.div key={task._id}
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.05 * i }}
                      className="flex items-center gap-3 px-5 py-3 group hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors">
                      {/* checkbox-style indicator */}
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        task.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-indigo-400 dark:group-hover:border-indigo-500'
                      }`}>
                        {task.status === 'completed' && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {/* title + meta */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate transition-colors ${
                          task.status === 'completed'
                            ? 'text-gray-400 dark:text-gray-500 line-through'
                            : 'text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white'
                        }`}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-600">
                            <Calendar className="h-3 w-3" /> {formatDate(task.createdAt)}
                          </span>
                        </div>
                      </div>
                      {/* status badge */}
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md flex-shrink-0 ${
                        task.status === 'completed'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {task.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Right panel — col 9-12 */}
          <div className="lg:col-span-4 space-y-4">
            {/* Progress widget */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="rounded-xl border border-gray-200/60 dark:border-white/[0.06]
                bg-white dark:bg-[#16161d] p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Completion Progress</h3>
              <div className="flex justify-center">
                {loading ? (
                  <Skeleton className="w-[140px] h-[140px] rounded-full" />
                ) : (
                  <RadialProgress percent={completionRate} />
                )}
              </div>
              {!loading && (
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{stats?.completed || 0}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Done</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{stats?.pending || 0}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Remaining</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Quick insights */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="rounded-xl border border-gray-200/60 dark:border-white/[0.06]
                bg-white dark:bg-[#16161d] p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Insights</h3>
              {[
                { icon: Sparkles, label: 'Productivity', detail: loading ? '—' : `${stats?.completed || 0} tasks done`, color: 'text-violet-500' },
                { icon: Zap, label: 'Active', detail: loading ? '—' : `${stats?.pending || 0} in progress`, color: 'text-amber-500' },
                { icon: Target, label: 'Focus', detail: loading ? '—' : (completionRate >= 50 ? 'On track' : 'Needs attention'), color: 'text-emerald-500' },
              ].map((insight) => (
                <div key={insight.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center">
                    <insight.icon className={`h-4 w-4 ${insight.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{insight.label}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">{insight.detail}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
