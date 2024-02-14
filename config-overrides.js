const webpack = require('webpack');

module.exports = function override(config, env) {
  config.ignoreWarnings = [/Failed to parse source map/];
  config.resolve.fallback = {
    url: require.resolve('url'),
    assert: require.resolve('assert'),
    crypto: require.resolve('crypto-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    buffer: require.resolve('buffer'),
    stream: require.resolve('stream-browserify'),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  if (!config.module) {
    config.module = { rules: [] };
  }

  config.module.rules.push({
    test: /\.js$/,
    use: ["source-map-loader"],
    enforce: "pre",
    exclude: /node_modules/,
  });

  return config;
};
