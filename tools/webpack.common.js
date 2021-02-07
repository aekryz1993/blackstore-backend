const { merge } = require('webpack-merge');
const path = require("path");
const nodeExternals = require("webpack-node-externals");

const parts = require("./webpack.parts");

const CURRENT_WORKING_DIR = process.cwd();

const res = p => path.resolve(CURRENT_WORKING_DIR, p);
const entry = res('server/index.js');
const output = res('dist');

module.exports = merge([
    { name: 'server' },
    { target: 'node' },
    { externals: [nodeExternals()] },
    { entry: [entry] },
    {
        output: {
            path: path.resolve(CURRENT_WORKING_DIR, "dist"),
            path: output,
            publicPath: "/",
        },
    },
    parts.clean(),
    parts.environmentVariables(),
    // parts.loadJavaScript(),
])