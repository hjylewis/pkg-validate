const execa = require('execa');
const getCommand = require('./getCommand');
const { Observable } = require('rxjs/Observable');

module.exports = function createTask(command) {
  const { bin, args } = getCommand(command);

  return {
    title: command,
    task: () => {
      const e = execa(bin, args);

      const error = new Observable(observer => {
        const onData = data => {
          const trimmed = data.toString('utf8').replace(/^\s+|\s+$/g, '');
          const path = trimmed.split(/\r?\n/);
          observer.next(path[path.length - 1]);
        };

        e.stdout.on('data', onData);
        e.stderr.on('data', onData);

        e
          .then(() => {
            // e.stdout.removeListener('data', onData);
            observer.complete();
          })
          .catch(err => {
            // e.stdout.removeListener('data', onData);
            observer.error(err);
            observer.complete();
          });
      });

      return error;
    }
  };
};
