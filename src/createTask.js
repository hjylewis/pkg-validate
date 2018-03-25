const execa = require('execa');
const perfy = require('perfy');
const prettyMs = require('pretty-ms');
const { Observable } = require('rxjs/Observable');
const getCommand = require('./getCommand');

module.exports = function createTask(command) {
  const { bin, args } = getCommand(command);

  return {
    title: command,
    task: (context, task) => {
      perfy.start(command);

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
            const { milliseconds } = perfy.end(command);
            task.title = `${task.title} (${prettyMs(milliseconds)})`;
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
