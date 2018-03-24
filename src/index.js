const cosmiconfig = require('cosmiconfig');

module.exports = function validate() {
  const explorer = cosmiconfig('pkg-validate', {
    rcExtensions: true
  })

  return explorer.load()
    .then((result) => {
      if (!result) throw new Error('Config could not be found')
      const {config} = result;
      console.log(config);
    })
    .catch(({message}) => {
      console.error(message);
    });
}
