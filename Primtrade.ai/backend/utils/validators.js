const { z } = require('zod');

/** Registration schema */
const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email')
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be at most 128 characters'),
});

/** Login schema */
const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email')
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

/** Update user schema */
const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Please provide a valid email')
    .trim()
    .toLowerCase()
    .optional(),
});

/** Task creation schema */
const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .trim()
    .optional()
    .default(''),
  status: z
    .enum(['pending', 'completed'], {
      errorMap: () => ({ message: 'Status must be pending or completed' }),
    })
    .optional()
    .default('pending'),
});

/** Task update schema */
const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be at most 200 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .trim()
    .optional(),
  status: z
    .enum(['pending', 'completed'], {
      errorMap: () => ({ message: 'Status must be pending or completed' }),
    })
    .optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  createTaskSchema,
  updateTaskSchema,
};
