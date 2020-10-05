const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Webpack = require('webpack');
const { MODE, PORT } = require('./src/server/environment');

module.exports = {
  entry: './src/client/index.js',
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules',
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        exclude: [/\.component.scss$/, /node_modules/],
        loader: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
      test: /\.component.scss$/,
        exclude: /node_modules/,
        use: [
          "sass-to-string",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                outputStyle: "compressed",
              },
            }
          }
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.ttf$/,
        loader: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/html/index.html'
    }),
    new CleanWebpackPlugin({}),
    new Webpack.DefinePlugin({
      'process.env.APIURL': JSON.stringify(`http://localhost:${PORT}/trip-info`),
      'process.env.MODE': JSON.stringify(MODE)
    })
  ]
};
