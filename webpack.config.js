/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = function (options, webpack) {
  //production:
  return {
    ...options,
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist_deploy/'),
    },
  };
};
