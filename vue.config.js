module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  /*
  // to configure WebPack devServer for local development with local api
  // relative url '/api/login' will match http://localhost:8081/api/login local api url
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // local firebase emulator url
        changeOrigin: true,
      },
    },
  },
  */
  css: {
    extract: { ignoreOrder: true },
  },
};
