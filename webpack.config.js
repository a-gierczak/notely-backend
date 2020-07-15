const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: './dist/src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.build.js',
  },
  externals: [nodeExternals()],
  resolve: {
    modules: [
      path.resolve(__dirname, 'dist'),
    ],
    extensions: ['.js'],
  },
  optimization: {
    minimize: false,
  }
};