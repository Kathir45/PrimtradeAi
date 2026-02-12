'use client';

import { useState } from 'react';
import { PageTransition } from '@/components/animations';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import {
  Bell,
  Globe,
  Shield,
  UserCog,
  LogOut,
  Palette,
  Plug,
  Lock,
} from 'lucide-react';

function ToggleRow({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-white/[0.08]'
        }`}
        aria-pressed={value}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
            value ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [profilePublic, setProfilePublic] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const setThemeMode = (mode) => {
    if ((mode === 'dark' && theme !== 'dark') || (mode === 'light' && theme !== 'light')) {
      toggleTheme();
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Manage appearance, security, and product preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Appearance */}
          <section className="lg:col-span-7 rounded-xl border border-gray-200/60 dark:border-white/[0.06] bg-white dark:bg-[#16161d] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                <Palette className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Appearance</h2>
                <p className="text-xs text-gray-500 dark:text-gray-500">Choose light or dark mode.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  theme === 'light'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200/70 dark:border-white/[0.06] bg-white dark:bg-[#1b1b22] text-gray-700 dark:text-gray-300'
                }`}
              >
                <p className="text-sm font-semibold">Light</p>
                <p className="text-xs mt-1 opacity-70">Bright background with crisp contrast.</p>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                    : 'border-gray-200/70 dark:border-white/[0.06] bg-white dark:bg-[#1b1b22] text-gray-700 dark:text-gray-300'
                }`}
              >
                <p className="text-sm font-semibold">Dark</p>
                <p className="text-xs mt-1 opacity-70">Layered blacks for focus at night.</p>
              </button>
            </div>
          </section>

          {/* Account & Session */}
          <section className="lg:col-span-5 rounded-xl border border-gray-200/60 dark:border-white/[0.06] bg-white dark:bg-[#16161d] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                <UserCog className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Account</h2>
                <p className="text-xs text-gray-500 dark:text-gray-500">Manage your session and access.</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                  bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-gray-200 dark:hover:bg-white/[0.12] transition-colors"
              >
                <Lock className="h-4 w-4" /> Change Password
              </button>
              <button
                type="button"
                onClick={logout}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                  bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="lg:col-span-7 rounded-xl border border-gray-200/60 dark:border-white/[0.06] bg-white dark:bg-[#16161d] p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h2>
            </div>
            <ToggleRow
              label="Email updates"
              description="Weekly progress and task reminders."
              value={emailNotifs}
              onChange={setEmailNotifs}
            />
            <ToggleRow
              label="Push notifications"
              description="Real-time alerts for tasks and deadlines."
              value={pushNotifs}
              onChange={setPushNotifs}
            />
            <ToggleRow
              label="Weekly report"
              description="Get a summary every Monday morning."
              value={weeklyReport}
              onChange={setWeeklyReport}
            />
          </section>

          {/* Privacy */}
          <section className="lg:col-span-5 rounded-xl border border-gray-200/60 dark:border-white/[0.06] bg-white dark:bg-[#16161d] p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Privacy</h2>
            </div>
            <ToggleRow
              label="Public profile"
              description="Allow others to view your profile."
              value={profilePublic}
              onChange={setProfilePublic}
            />
            <ToggleRow
              label="Activity status"
              description="Show when you are active."
              value={activityStatus}
              onChange={setActivityStatus}
            />
          </section>

          {/* Preferences */}
          <section className="lg:col-span-7 rounded-xl border border-gray-200/60 dark:border-white/[0.06] bg-white dark:bg-[#16161d] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center">
                <Globe className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Preferences</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-500">Language</label>
                <select className="mt-1 w-full rounded-lg border border-gray-200/70 dark:border-white/[0.06] bg-white dark:bg-[#1b1b22] px-3 py-2 text-sm text-gray-800 dark:text-gray-200">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>Thai</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-500">Time Zone</label>
                <select className="mt-1 w-full rounded-lg border border-gray-200/70 dark:border-white/[0.06] bg-white dark:bg-[#1b1b22] px-3 py-2 text-sm text-gray-800 dark:text-gray-200">
                  <option>GMT +7 (Bangkok)</option>
                  <option>GMT +1 (Berlin)</option>
                  <option>GMT -5 (New York)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Integrations + Security */}
          <section className="lg:col-span-5 rounded-xl border border-gray-200/60 dark:border-white/[0.06] bg-white dark:bg-[#16161d] p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                  <Plug className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Integrations</h2>
              </div>
              <div className="flex items-center justify-between gap-3 py-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">Connect Slack</p>
                <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Connect</button>
              </div>
              <div className="flex items-center justify-between gap-3 py-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">Connect Google Calendar</p>
                <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Connect</button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center">
                  <Shield className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Security</h2>
              </div>
              <ToggleRow
                label="Two-factor authentication"
                description="Add an extra layer of security to your account."
                value={twoFactor}
                onChange={setTwoFactor}
              />
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
