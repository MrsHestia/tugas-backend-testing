const { getAllTasks, addTask } = require('../src/taskService');

test('Harus bisa menambah tugas baru', () => {
    const task = { id: 1, name: 'Tugas Baru' };
    expect(addTask(task)).toEqual(task);
    expect(getAllTasks()).toContain(task);
});