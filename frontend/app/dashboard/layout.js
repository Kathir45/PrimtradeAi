'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  LayoutDashboard,
  User,
  CheckSquare,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

// ─── Sidebar Component ─────────────────────────────────────────────────────────

function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-64';

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen ${sidebarWidth} bg-white dark:bg-[#111116] border-r border-gray-200/80 dark:border-white/[0.06] z-50 transform transition-all duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full relative">
          {/* Collapse Toggle (desktop only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-full items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10 text-gray-500 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-dark-700">
            <Link href="/" className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden"
                  >
                    Primtrade<span className="text-primary-600 dark:text-primary-400">.ai</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-dark-700"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-dark-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${collapsed ? 'justify-center' : ''}
                    ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-sm'
                        : 'text-gray-600 dark:text-dark-400 hover:bg-gray-50 dark:hover:bg-dark-700/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-600 dark:bg-primary-400 rounded-r-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-dark-500 group-hover:text-gray-600 dark:group-hover:text-dark-300'
                    }`}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>

          {/* User info + Logout */}
          <div className="border-t border-gray-200 dark:border-dark-700 p-3">
            <div className={`flex items-center gap-3 mb-2 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-500 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Dashboard Layout ────────────────────────────────────────────────────────

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-[#f8f9fb] dark:bg-[#0c0c10] transition-colors duration-300">
        {/* Ambient background glow */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-primary-500/[0.04] dark:bg-primary-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-500/[0.03] dark:bg-violet-500/[0.02] rounded-full blur-[100px]" />
        </div>

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((p) => !p)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-30 h-14 bg-white/70 dark:bg-[#0c0c10]/70 backdrop-blur-2xl border-b border-gray-200/60 dark:border-white/[0.04] flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-dark-400" />
              </button>
              <span className="lg:hidden text-lg font-bold text-gray-900 dark:text-white">
                Primtrade<span className="text-primary-600 dark:text-primary-400">.ai</span>
              </span>
            </div>

          </header>

          <main className="flex-1 p-4 sm:p-5 lg:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
