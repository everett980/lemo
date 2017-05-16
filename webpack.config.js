'use strict';

var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: './public',
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    plugins: process.env.NODE_ENV === 'production' ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin()
    ] : [],
    loaders: [
      {
        test: /\.jsx?$/, exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
}
