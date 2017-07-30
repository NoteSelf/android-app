var path = require('path');
var BitBarWebpackProgressPlugin = require("bitbar-webpack-progress-plugin");
var webpack = require('webpack');
var ignore = new webpack.IgnorePlugin(/sjcl.js$|[.]{2}\/package.json$|fs|path/);

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'www')
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    module: {
        rules:
        [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
            , {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new BitBarWebpackProgressPlugin(),
        ignore
    ]
};