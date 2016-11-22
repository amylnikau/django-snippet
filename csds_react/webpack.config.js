'use strict';

var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

var config = module.exports = {

    devtool: 'source-map',

    // our application's entry points - for this example we'll use a single each for
    // css and js
    entry: {
        application: [
            './src/css/application.sass',
            './src/js/application.js',
        ],
    },

    // where webpack should output our files
    output: {
        path: '../assets/',
        publicPath: "http://localhost:8080/assets/bundles/",
        filename: 'js/application.js',
    },

    resolve: {
        extensions: ['', '.js', '.sass'],
        modulesDirectories: ['node_modules'],
    },

    // more information on how our modules are structured, and
    //
    // in this case, we'll define our loaders for JavaScript and CSS.
    // we use regexes to tell Webpack what files require special treatment, and
    // what patterns to exclude.
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    plugins: ['transform-decorators-legacy'],
                    presets: ['react', 'es2015', 'stage-2', 'stage-0'],
                },
            },
            {
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract('style', 'css!sass?indentedSyntax&includePaths[]=' + __dirname + '/node_modules'),
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ],
    },

    // what plugins we'll be using - in this case, just our ExtractTextPlugin.
    // we'll also tell the plugin where the final CSS file should be generated
    // (relative to config.output.path)
    plugins: [
        new ExtractTextPlugin('css/application.css'),
        new BundleTracker({filename: './webpack-stats.json'}),
    ],
};

// if running webpack in production mode, minify files with uglifyjs
if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    );
}
