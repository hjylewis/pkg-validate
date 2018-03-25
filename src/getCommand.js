const which = require('npm-which')(process.cwd());

module.exports = function getCommand(rawCommand) {
  const [binName, ...args] = rawCommand.split(' ');

  return {
    bin: which.sync(binName),
    args
  };
};
