'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Premium input field with animated label, password toggle, and error animation.
 */
export default function InputField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  autoComplete,
  icon: Icon,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-dark-800 transition-colors"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
            <Icon
              className={`h-[18px] w-[18px] transition-colors duration-200 ${
                focused
                  ? 'text-primary-500'
                  : error
                  ? 'text-red-400'
                  : 'text-gray-400 dark:text-dark-600'
              }`}
            />
          </div>
        )}
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`input-field ${Icon ? 'pl-11' : ''} ${isPassword ? 'pr-11' : ''} ${
            error ? 'input-error' : ''
          } ${disabled ? 'bg-gray-100 dark:bg-dark-300 cursor-not-allowed opacity-60' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center z-10"
          >
            <motion.div
              key={showPassword ? 'visible' : 'hidden'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px] text-gray-400 hover:text-gray-600 dark:text-dark-600 dark:hover:text-dark-800 transition-colors" />
              ) : (
                <Eye className="h-[18px] w-[18px] text-gray-400 hover:text-gray-600 dark:text-dark-600 dark:hover:text-dark-800 transition-colors" />
              )}
            </motion.div>
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-sm text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
