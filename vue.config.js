
module.exports = {
  devServer: {
    https: false,
    disableHostCheck: true
  },
  configureWebpack: {
  },
  pages: {
    index: {
      // точка входа для страницы
      entry: './src/main.js',
      // исходный шаблон
      template: 'public/index.html',
      // когда используется опция title, то <title> в шаблоне
      // должен быть <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Signum Video'
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}
