const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    // path: __dirname + "dist/",
    filename: "bundle.js",
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      // options: {
      //   presets: ["es2015"],
      // },
    }, ],
  },
  devServer: {
    hot: true,
    // open: true,
    contentBase: "/react_simple/dist",
    port: 3001,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      minify: {
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
    }),
  ],
};