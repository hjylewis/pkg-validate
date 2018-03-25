const execa = require('execa');
const getCommand = require('./getCommand');

module.exports = function createTask(command) {
  const { bin, args } = getCommand(command);

  return {
    title: command,
    task: () => {
      return execa(bin, args);
    }
  };
};
