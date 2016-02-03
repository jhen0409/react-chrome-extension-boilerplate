import path from 'path';
import webpack from 'webpack';

const port = 3000;
const entry = [
  `webpack-dev-server/client?https://localhost:${port}`,
  'webpack/hot/only-dev-server'
];

export default {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    window: [path.join(__dirname, '../chrome/extension/window'), ...entry],
    popup: [path.join(__dirname, '../chrome/extension/popup'), ...entry],
    background: [path.join(__dirname, '../chrome/extension/background'), ...entry],
    inject: [path.join(__dirname, '../chrome/extension/inject'), ...entry]
  },
  output: {
    path: path.join(__dirname, '../dev/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    publicPath: `https://localhost:${port}/js/`
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
    new webpack.DefinePlugin({
      'process.env': {
        DEVTOOLS: !!process.env.DEVTOOLS || true,
        DEVTOOLS_EXT: !!process.env.DEVTOOLS_EXT
      }
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['react-hmre']
      }
    }, {
      test: /\.css?$/,
      loaders: ['style', 'raw']
    }]
  }
};