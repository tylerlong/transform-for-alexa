const config = {
  target: 'node',
  entry: {
    'audios': ['babel-polyfill', './audios/index.js']
  },
  output: {
    path: __dirname,
    filename: '[name]/handler.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', { 'targets': { 'node': '6.10' } }]
            ]
          }
        }
      }
    ]
  }
}

export default [config]
