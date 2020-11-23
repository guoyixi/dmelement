module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'plugins': '@/plugins',
        'network': '@/network',
        'views': '@/views',
      }
    }
  },
  devServer: {
    open: false,
    hot: true,
    compress: true,
    proxy: {
      "/":{
        target:'http://localhost:8981'
      }
    }
  },
  publicPath:""

}