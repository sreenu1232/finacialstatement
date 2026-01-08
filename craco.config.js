const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "url": require.resolve("url/"),
        "buffer": require.resolve("buffer/"),
        "util": require.resolve("util/"),
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify"),
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "assert": require.resolve("assert/"),
        "process": require.resolve("process/browser"),
        "fs": false,
        "net": false,
        "tls": false,
      };
      
      // Add process plugin to make it available globally
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ];
      
      return webpackConfig;
    },
  },
};

