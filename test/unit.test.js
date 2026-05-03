const request = require('supertest');
const app = require('../src/app');
const {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  resetTasks
} = require('../src/taskService');

beforeEach(() => {
  resetTasks();
});

// =====================
// UNIT TEST (15 test)
// =====================

describe('Unit Test - addTask', () => {
  test('1. Harus bisa menambah task dengan title valid', () => {
    const task = addTask({ title: 'Belajar Jest' });
    expect(task.title).toBe('Belajar Jest');
    expect(task.status).toBe('pending');
    expect(task.id).toBeDefined();
  });

  test('2. Task baru harus masuk ke list', () => {
    addTask({ title: 'Task A' });
    expect(getAllTasks()).toHaveLength(1);
  });

  test('3. Error jika title kosong', () => {
    expect(() => addTask({ title: '' })).toThrow('Title wajib diisi');
  });

  test('4. Error jika title tidak ada', () => {
    expect(() => addTask({})).toThrow('Title wajib diisi');
  });

  test('5. Error jika title lebih dari 100 karakter', () => {
    const longTitle = 'A'.repeat(101);
    expect(() => addTask({ title: longTitle })).toThrow('Title maksimal 100 karakter');
  });

  test('6. Error jika status tidak valid', () => {
    expect(() => addTask({ title: 'Test', status: 'invalid' })).toThrow('Status tidak valid');
  });

  test('7. Status default adalah pending', () => {
    const task = addTask({ title: 'No Status' });
    expect(task.status).toBe('pending');
  });

  test('8. Bisa set status in-progress', () => {
    const task = addTask({ title: 'Task', status: 'in-progress' });
    expect(task.status).toBe('in-progress');
  });
});

describe('Unit Test - getTaskById', () => {
  test('9. Harus return task yang benar berdasarkan ID', () => {
    const task = addTask({ title: 'Cari Task' });
    expect(getTaskById(task.id)).toEqual(task);
  });

  test('10. Return null jika ID tidak ditemukan', () => {
    expect(getTaskById(999)).toBeNull();
  });
});

describe('Unit Test - updateTask', () => {
  test('11. Harus bisa update title task', () => {
    const task = addTask({ title: 'Lama' });
    const updated = updateTask(task.id, { title: 'Baru' });
    expect(updated.title).toBe('Baru');
  });

  test('12. Harus bisa update status task', () => {
    const task = addTask({ title: 'Task' });
    const updated = updateTask(task.id, { status: 'done' });
    expect(updated.status).toBe('done');
  });

  test('13. Return null jika ID tidak ditemukan saat update', () => {
    expect(updateTask(999, { title: 'Test' })).toBeNull();
  });
});

describe('Unit Test - deleteTask', () => {
  test('14. Harus bisa menghapus task', () => {
    const task = addTask({ title: 'Hapus Ini' });
    deleteTask(task.id);
    expect(getAllTasks()).toHaveLength(0);
  });

  test('15. Return null jika ID tidak ditemukan saat delete', () => {
    expect(deleteTask(999)).toBeNull();
  });
});

describe('Unit Test - getTasksByStatus', () => {
  test('16. Harus filter task berdasarkan status', () => {
    addTask({ title: 'Task 1', status: 'pending' });
    addTask({ title: 'Task 2', status: 'done' });
    expect(getTasksByStatus('pending')).toHaveLength(1);
    expect(getTasksByStatus('done')).toHaveLength(1);
  });
});

// =====================
// INTEGRATION TEST (5 test)
// =====================

describe('Integration Test - API Endpoints', () => {
  test('1. GET /tasks harus return array kosong awalnya', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('2. POST /tasks harus buat task baru', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Task Baru', status: 'pending' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Task Baru');
    expect(res.body.id).toBeDefined();
  });

  test('3. POST /tasks dengan data invalid harus return 400', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('4. PUT /tasks/:id harus update task', async () => {
    const post = await request(app).post('/tasks').send({ title: 'Sebelum' });
    const id = post.body.id;
    const res = await request(app).put(`/tasks/${id}`).send({ status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('done');
  });

  test('5. DELETE /tasks/:id harus hapus task', async () => {
    const post = await request(app).post('/tasks').send({ title: 'Hapus' });
    const id = post.body.id;
    const res = await request(app).delete(`/tasks/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task berhasil dihapus');
  });
});