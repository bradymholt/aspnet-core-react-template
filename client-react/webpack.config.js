var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var releaseConfig = require('./webpack.config.release');
var isProductionEnvironment = process.env.ASPNETCORE_ENVIRONMENT === 'Production';
var path = require('path');
var merge = require('extendify')({ isDeep: true, arrays: 'replace' });

var config = {
    entry: {
        main: [path.join(__dirname, 'boot.tsx')]
    },
    output: {
        path: path.join(__dirname, '../api/', 'wwwroot'),
        filename: '[name].js',
        publicPath: '/'
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".styl"]
    },

    module: {
        loaders: [
            // Use react-hot for HMR and then awesome-typescript-loader to transpile TS (pass path to tsconfig because it is not in root (cwd) path)
            { test: /\.ts(x?)$/, loaders: ['react-hot', `awesome-typescript-loader?tsconfig=${path.join(__dirname, 'tsconfig.json')}`] },
            // We do not use ExtractTextPlugin in development mode so that HMR will work with styles
            { test: /\.styl$/, loader: 'style-loader!css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!stylus-loader' },
            { test: /\.css/, loader: 'style-loader!css-loader' }
        ]
    },

    devtool: 'inline-source-map',

    // plugins should not be empty: https://github.com/aspnet/JavaScriptServices/tree/dev/src/Microsoft.AspNetCore.SpaServices'
    plugins: [new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.ejs')
    })]
};

if (isProductionEnvironment) {
    // Merge production config
    config = merge(config, releaseConfig);
}

module.exports = config;
