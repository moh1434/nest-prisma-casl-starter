/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require('webpack-node-externals');

module.exports = function (options, webpack) {
  if (process.env.NODE_ENV == 'development') {
    //development:
    return {
      entry: ['webpack/hot/poll?100', options.entry],
      externals: [
        nodeExternals({
          allowlist: ['webpack/hot/poll?100'],
        }),
      ],
      plugins: [
        ...options.plugins,
        new webpack.WatchIgnorePlugin({
          paths: [/\.js$/, /\.d\.ts$/],
        }),
        new webpack.HotModuleReplacementPlugin(),
      ],
    };
  } else {
    //production:
    return {
      ...options,
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist_deploy/'),
      },
    };
  }
};
