const Listr = require('listr');
const createTask = require('./createTask');

module.exports = function runTasks(config) {
  const tasks = config.map(createTask);

  return new Listr(tasks, { concurrent: true }).run();
};
