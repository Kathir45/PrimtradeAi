const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createTaskSchema, updateTaskSchema } = require('../utils/validators');

const router = express.Router();

// All task routes are protected
router.use(protect);

router.post('/', validate(createTaskSchema), createTask);
router.get('/', getTasks);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
