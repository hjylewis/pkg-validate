const execa = require('execa');
const getCommand = require('./getCommand');
const { Observable } = require('rxjs/Observable');

module.exports = function createTask(command) {
  const { bin, args } = getCommand(command);

  return {
    title: command,
    task: () => {
      return new Observable(observer => {
        const process = execa(bin, args);

        const onData = data => {
          const path = data
            .toString('utf8')
            .replace(/^\s+|\s+$/g, '')
            .split(/\r?\n/);
          observer.next(path[path.length - 1]);
        };

        process.stdout.on('data', onData);
        process.stderr.on('data', onData);

        process
          .then(() => {
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          })
          .then(() => {
            process.stdout.removeListener('data', onData);
            process.stderr.removeListener('data', onData);
          });
      });
    }
  };
};
