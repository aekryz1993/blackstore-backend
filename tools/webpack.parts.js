const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NodemonPlugin = require('nodemon-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const APP_SOURCE = path.join(__dirname, "server");

exports.loadJavaScript = () => ({
    module: {
        rules: [
            {
                test: /\.js$/,
                include: APP_SOURCE, // Consider extracting as a parameter
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
});

exports.clean = () => ({
    plugins: [new CleanWebpackPlugin()],
});

exports.generateSourceMaps = ({ type }) => ({
    devtool: type,
});

exports.NodemonPlugin = (options) => ({
    plugins: [new NodemonPlugin(options)],
});

exports.environmentVariables = (options) => ({
    plugins: [new Dotenv(options)],
})