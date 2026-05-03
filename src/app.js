const express = require('express');
const app = express();
const {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
  getTasksByStatus
} = require('./taskService');

app.use(express.json());

// GET semua task (bisa filter by status)
app.get('/tasks', (req, res) => {
  const { status } = req.query;
  if (status) {
    const validStatus = ['pending', 'in-progress', 'done'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' });
    }
    return res.json(getTasksByStatus(status));
  }
  res.json(getAllTasks());
});

// GET task by ID
app.get('/tasks/:id', (req, res) => {
  const task = getTaskById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task tidak ditemukan' });
  res.json(task);
});

// POST buat task baru
app.post('/tasks', (req, res) => {
  try {
    const task = addTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update task
app.put('/tasks/:id', (req, res) => {
  try {
    const task = updateTask(req.params.id, req.body);
    if (!task) return res.status(404).json({ error: 'Task tidak ditemukan' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE task
app.delete('/tasks/:id', (req, res) => {
  const task = deleteTask(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task tidak ditemukan' });
  res.json({ message: 'Task berhasil dihapus', task });
});

module.exports = app;