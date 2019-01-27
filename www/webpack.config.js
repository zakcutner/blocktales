const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlBeautifyPlugin = require("html-beautify-webpack-plugin");

const TerserPlugin = require("terser-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  mode: "production",

  entry: {
    polyfill: "babel-polyfill",
    index: "./js/index.js"
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].min.js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.worker\.js$/,
        exclude: /(node_modules)/,
        use: { loader: "worker-loader" }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass")
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "blocktales",
      template: "./index.html",
      meta: {
        charset: "utf-8"
      },
      minify: false
    }),

    new HtmlBeautifyPlugin({
      config: {
        html: {
          end_with_newline: true,
          indent_size: 2
        }
      }
    }),

    new MiniCssExtractPlugin({
      filename: "[name].min.css",
      chunkFilename: "[id].min.css"
    })
  ],

  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})]
  }
};
