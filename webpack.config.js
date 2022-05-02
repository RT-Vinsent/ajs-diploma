const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// конфигурация Webpack - это обычный JS-модуль
module.exports = {
  entry: './src/index.js', // входной файл
  output: {
    path: path.resolve(__dirname, 'dist'), // папка куда помещаем собранный пакет
  },
  // devtool: 'inline-source-map', // карты кода для отладки
  devServer: {
    // contentBase: './dist', // папка из которой будет брать контент сервер разработки
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },

  // правила преобразования
  module: {
    rules: [
      {
        test: /\.js$/, // для всех javascript-файлов
        exclude: /node_modules/, // за исключением папки с загружаемыми пакетами
        use: {
          loader: 'babel-loader', // используем транспайлер Babel
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader',
        ],
      },
      // я весь инет перерыл и не мог понять почему не работает url-loader
      // а оказывается он просто устарел как и ЗАДАНИЕ ПО ДИПЛОМУ.
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8192,
          },
        },
      },
    ],
  },
  plugins: [
    // данный плагин вставляет ссылку на собранный пакет в html шаблон
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      favicon: './src/img/characters/undead.png',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};
