let tasks = [];

const getAllTasks = () => tasks;
const addTask = (task) => {
    tasks.push(task);
    return task;
};

module.exports = { getAllTasks, addTask };