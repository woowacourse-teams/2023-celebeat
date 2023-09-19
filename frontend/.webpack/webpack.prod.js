const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production',
  entry: ['./src/index.tsx'],
  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(jpg|jpeg|gif|png|ico)?$/,
        type: 'asset',
        generator: {
          filename: 'images/[name].[ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)?$/,
        type: 'asset',
        generator: {
          filename: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },

  devServer: {
    static: {
      directory: path.resolve(__dirname, '../public'),
    },
    hot: true,
    open: true,
    historyApiFallback: true,
    allowedHosts: 'all',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new ForkTsCheckerWebpackPlugin(),
    new Dotenv({
      path: path.resolve(__dirname, `../.prod.env`),
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
  ],

  devtool: 'source-map',
};
