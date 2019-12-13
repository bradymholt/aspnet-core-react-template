var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var releaseConfig = require("./webpack.config.release");
var isProductionEnvironment =
    process.env.ASPNETCORE_ENVIRONMENT === "Production";
var path = require("path");
var merge = require("extendify")({ isDeep: true, arrays: "replace" });

var config = {
    mode: "development",
    entry: {
        main: path.join(__dirname, "boot.tsx")
    },
    output: {
        path: path.join(__dirname, "../api/", "wwwroot"),
        filename: "[name].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".styl", ".css"]
    },
    module: {
        rules: [
            {
                test: /\.styl$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 2,
                            sourceMap: false
                        }
                    },
                    {
                        loader: "stylus-loader"
                    }
                ]
            },
            { test: /\.ts(x?)$/, loaders: ["ts-loader"] },
            { test: /\.css/, loader: "style-loader!css-loader" },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: "url-loader?limit=100000"
            }
        ]
    },
    devtool: "inline-source-map",
    plugins: [
        // plugins should not be empty: https://github.com/aspnet/JavaScriptServices/tree/dev/src/Microsoft.AspNetCore.SpaServices'[
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "index.ejs"),
            inject: true
        })
        // new webpack.NamedModulesPlugin()
        // We do not use ExtractTextPlugin in development mode so that HMR will work with styles
    ]
};

if (isProductionEnvironment) {
    // Merge production config
    config = merge(config, releaseConfig);
}

module.exports = config;
