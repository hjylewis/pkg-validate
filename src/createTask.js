const execa = require('execa');
const prettyMs = require('pretty-ms');
const { Observable } = require('rxjs/Observable');
const convertHrtime = require('convert-hrtime');
const getCommand = require('./getCommand');

module.exports = function createTask(command) {
  const { bin, args } = getCommand(command);

  return {
    title: command,
    task: (context, task) => {
      const duration = process.hrtime();

      return new Observable(observer => {
        const childProcess = execa(bin, args);

        const onData = data => {
          const path = data
            .toString('utf8')
            .replace(/^\s+|\s+$/g, '')
            .split(/\r?\n/);
          observer.next(path[path.length - 1]);
        };

        childProcess.stdout.on('data', onData);
        childProcess.stderr.on('data', onData);

        childProcess
          .then(() => {
            const { milliseconds } = convertHrtime(process.hrtime(duration));
            task.title = `${task.title} (${prettyMs(milliseconds)})`;
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          })
          .then(() => {
            childProcess.stdout.removeListener('data', onData);
            childProcess.stderr.removeListener('data', onData);
          });
      });
    }
  };
};
