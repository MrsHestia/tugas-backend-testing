let tasks = [];
let nextId = 1;

const getAllTasks = () => tasks;

const getTaskById = (id) => {
  return tasks.find(t => t.id === parseInt(id)) || null;
};

const addTask = (data) => {
  if (!data.title || data.title.trim() === '') {
    throw new Error('Title wajib diisi');
  }
  if (data.title.length > 100) {
    throw new Error('Title maksimal 100 karakter');
  }

  const validStatus = ['pending', 'in-progress', 'done'];
  const status = data.status || 'pending';
  if (!validStatus.includes(status)) {
    throw new Error('Status tidak valid. Gunakan: pending, in-progress, done');
  }

  const task = {
    id: nextId++,
    title: data.title.trim(),
    description: data.description || '',
    status: status,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  return task;
};

const updateTask = (id, data) => {
  const index = tasks.findIndex(t => t.id === parseInt(id));
  if (index === -1) return null;

  if (data.title !== undefined) {
    if (data.title.trim() === '') throw new Error('Title tidak boleh kosong');
    if (data.title.length > 100) throw new Error('Title maksimal 100 karakter');
    tasks[index].title = data.title.trim();
  }

  const validStatus = ['pending', 'in-progress', 'done'];
  if (data.status !== undefined) {
    if (!validStatus.includes(data.status)) {
      throw new Error('Status tidak valid. Gunakan: pending, in-progress, done');
    }
    tasks[index].status = data.status;
  }

  if (data.description !== undefined) {
    tasks[index].description = data.description;
  }

  return tasks[index];
};

const deleteTask = (id) => {
  const index = tasks.findIndex(t => t.id === parseInt(id));
  if (index === -1) return null;
  const deleted = tasks[index];
  tasks.splice(index, 1);
  return deleted;
};

const getTasksByStatus = (status) => {
  return tasks.filter(t => t.status === status);
};

const resetTasks = () => {
  tasks = [];
  nextId = 1;
};

module.exports = {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  resetTasks
};