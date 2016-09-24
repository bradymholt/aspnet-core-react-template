var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');

module.exports = {
    module: {
        loaders: [
            // Use react-hot for HMR and then awesome-typescript-loader to transpile TS (pass path to tsconfig because it is not in root (cwd) path)
            { test: /\.ts(x?)$/, loaders: [`awesome-typescript-loader?tsconfig=${path.join(__dirname, 'tsconfig.json')}`] },
            { test: /\.styl$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!stylus-loader') },
            { test: /\.css/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') }
        ]
    },
    devtool: '',
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    },
    plugins: [
        new HtmlWebpackPlugin({
            release: true,
            template: path.join(__dirname, 'index.ejs'),
            useCdn: true,
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin("styles.css")

    ]
};
