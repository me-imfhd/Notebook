/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    extends: [require.resolve('@notebook/eslint-config/next')],
    parserOptions: {
      project: `${__dirname}/tsconfig.json`,
    },
  };