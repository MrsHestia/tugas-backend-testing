const express = require('express');
const app = express();
const { getAllTasks, addTask } = require('./taskService');

app.use(express.json());

app.get('/tasks', (req, res) => res.json(getAllTasks()));
app.post('/tasks', (req, res) => res.status(201).json(addTask(req.body)));

module.exports = app;