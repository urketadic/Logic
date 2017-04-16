var path = require('path');

module.exports = {
  entry: {
          "vendor":  ['./public/assets/js/vendor/jquery-3.2.1.js','./public/assets/js/vendor/analytics.js', './public/assets/js/vendor/bootstrap.js'],
          "default": ['./public/assets/js/variable.js'],
          "main": './public/assets/js/main.js',
          "foursteps": './public/assets/js/foursteps.js'
         },
  output: {
    path: path.join(__dirname, 'scripts'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.css$/, loader: 'style!css'}
    ]
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js']
  },
  node: {
    console: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
};