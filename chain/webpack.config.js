const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",

  entry: {
    index: "./index.js"
  },

  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ]
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].min.js"
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "Blocktales",
      template: "./index.html",
      meta: {
        charset: "utf-8"
      },
      minify: false
    })
  ],

  optimization: {
    minimizer: [new TerserPlugin()]
  }
};
