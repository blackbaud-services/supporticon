const path = require('path');

module.exports = {
  entry: './playground/src/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'playground/dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: './playground',
    port: 3001,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};