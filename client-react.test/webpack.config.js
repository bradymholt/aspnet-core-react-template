var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    entry: {
        tests: [path.join(__dirname, './index.js')]
    },
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
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".styl"]
    },

    module: {
        loaders: [
            // Use react-hot for HMR and then ts-loader to transpile TS (pass path to tsconfig because it is not in root (cwd) path)
            { test: /\.ts(x?)$/, loaders: ['ts-loader'] },
            { test: /\.styl$/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]!stylus-loader' }) },
            { test: /\.css/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }) }
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
