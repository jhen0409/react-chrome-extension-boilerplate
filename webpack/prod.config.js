import path from 'path';
import webpack from 'webpack';

export default {
  entry: {
    window: [ path.join(__dirname, '../chrome/app/window/index') ],
    popup: [ path.join(__dirname, '../chrome/app/popup/index') ],
    background: [ path.join(__dirname, '../chrome/app/background/index') ],
    inject: [ path.join(__dirname, '../chrome/app/inject/index') ]
  },
  output: {
    path: path.join(__dirname, '../build/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compressor: {
        warnings: false
      }
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/
    }, {
      test: /\.css?$/,
      loaders: ['style', 'raw']
    }]
  }
};