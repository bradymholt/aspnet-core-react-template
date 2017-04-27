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
        rules: [
            {
                test: /\.styl$/,
                use: [{
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        camelCase: true,
                        importLoaders: 2,
                        sourceMap: false,
                        localIdentName: "[local]___[hash:base64:5]"
                    }
                }, {
                    loader: 'stylus-loader'
                }]
            },
            // Use react-hot for HMR and then ts-loader to transpile TS (pass path to tsconfig because it is not in root (cwd) path)
            { test: /\.ts(x?)$/, loaders: ['ts-loader'] }
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
    ]
};
