const webpack = require('webpack');

module.exports = {
    entry: {
        main: './src/index',
    },
    output: {
        path: './dist',
        publicPath: '/dist',
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'bonestore',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.js'],
    },
};
