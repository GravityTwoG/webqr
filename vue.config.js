/* eslint-disable */
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
/* eslint-enable */

const plugins = [];

if (process.argv.includes('--analyze')) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  configureWebpack: {
    plugins,
  },
};
