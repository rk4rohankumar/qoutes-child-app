const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.publicPath = 'http://localhost:3009/';

      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: 'QuotesApp',
          filename: 'remoteEntry.js',
          exposes: {
            './QuotesApp': './src/App',
          },
          shared: {
            react: { eager: true },
            'react-dom': { eager: true },
            'tailwindcss': { eager: true }
          },
        })
      );
      return webpackConfig;
    },
  },
};
