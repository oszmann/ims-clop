// Generated using webpack-cli https://github.com/webpack/webpack-cli

path = require("path");


const isProduction = process.env.NODE_ENV == 'production'

const stylesHandler = "style-loader";

const config = {
  mode: isProduction ? 'development' : 'production',
  entry: "./src/client/main.ts",
  output: {
    filename: 'main.js',
    path: path.join(__dirname, "dist", "client"),
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

module.exports = () => {
  if (isProduction) {
      config.mode = 'production';
      
      
  } else {
      config.mode = 'development';
  }
  return config;
};
