var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var config = {
    entry: {
        tests: [path.join(__dirname, './index.js')]
    },
    cwd: './dist',
    output: {
        path: path.join(__dirname, './build/'),
        filename: '[name].js',
        libraryTarget: "commonjs",
        devtoolModuleFilenameTemplate: "file://[absolute-resource-path]",
        devtoolFallbackModuleFilenameTemplate: "file://[absolute-resource-path]?[hash]",
        pathinfo: true,
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".styl"]
    },

    module: {
        loaders: [
            // Use react-hot for HMR and then awesome-typescript-loader to transpile TS (pass path to tsconfig because it is not in root (cwd) path)
            { test: /\.ts(x?)$/, loaders: [`awesome-typescript-loader?tsconfig=${path.join(__dirname, 'tsconfig.json')}&sourceMap=true`] },
            { test: /\.styl$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]!stylus-loader') },
            { test: /\.css/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') }
        ]
    },

    externals: {
        module: true,
        jsdom: true,
        mocha: true,
        chai: true,
        enzyme: true

    },

    devtool: 'source-map',
    plugins: [
        new ExtractTextPlugin("[name].css")
    ]
};

module.exports = config;
