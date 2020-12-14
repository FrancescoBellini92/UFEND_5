const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const WorkBoxPlugin = require('workbox-webpack-plugin');

const Webpack = require('webpack');

module.exports = {
  entry: './src/client/index.ts',
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js']
  },
  optimization: {
    // terser minifies js, opmtimizeCss minifies css
    minimizer: [new TerserPlugin({}), new OptimizeCssAssetsPlugin({})]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: ['/node_modules', /\.spec.ts$/],
        loader: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.scss$/,
        exclude: [/\.component.scss$/, /node_modules/],
        // mini will extract css into a single file
        loader: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.component.scss$/,
        exclude: /node_modules/,
        use: [
          'sass-to-string',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'compressed'
              }
            }
          }
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.(png|ttf)$/,
        loader: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/html/index.html'
    }),
    new CleanWebpackPlugin({}),
    new MiniCssExtractPlugin({}),
    new Webpack.DefinePlugin({
      'process.env.APIURL': JSON.stringify('/trip-info'),
      'process.env.MODE': JSON.stringify('PROD')
    }),
    new WorkBoxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
    new FaviconsWebpackPlugin({
      logo: './src/assets/icons/icon.png',
      favicons: {
        appName: 'Travel app',
        appShortName: 'Travel app',
        appDescription: '',
        version: '1.0',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0A6885',
        icons: {
          coast: false,
          yandex: false
        }
      }
    })
  ]
};
