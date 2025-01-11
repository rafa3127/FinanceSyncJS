const path = require("path");

const common = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true // Habilita la minimización
  },
  devtool: 'source-map', // Genera mapas de fuente para depuración
};

const esmConfig = {
  ...common,
  output: {
    filename: 'index.esm.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'module'
  },
  experiments: {
    outputModule: true
  },
  target: 'web',  // Ajusta para compatibilidad web
};

module.exports = [esmConfig];
