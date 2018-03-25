const cosmiconfig = require('cosmiconfig');
const runTasks = require('./runTasks');

module.exports = function validate() {
  const explorer = cosmiconfig('pkg-validate', {
    rcExtensions: true
  });

  return explorer
    .load()
    .then(result => {
      if (!result) throw new Error('Config could not be found');
      const { config } = result;

      return runTasks(config);
    })
    .catch(({ message }) => {
      console.error(message);

      // Other parallel tasks might still be running so manually exit
      process.exit(1);
    });
};
