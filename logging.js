import chalk from "chalk";
const log = console.log;

export const showError = (errMsg) => {
  log(chalk.red(errMsg));
  process.exit(1);
};
