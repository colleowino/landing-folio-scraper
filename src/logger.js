const chalk = require('chalk');

const logger = {
  good: function green(txt) {
    console.log(chalk.green(txt)); // eslint-disable-line no-console
  },
  bad: function red(txt) {
    console.log(chalk.red(txt)); // eslint-disable-line no-console
  },
  say: function yellow(txt) {
    console.log(chalk.yellow(txt)); // eslint-disable-line no-console
  },
};

export default logger;
