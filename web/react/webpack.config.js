const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, '../connectome/static/scripts');
const APP_DIR = path.resolve(__dirname, 'js');

//devtool2: '#cheap-module-eval-source-map',
const config = {
    entry: {
        app: APP_DIR + '/app.js',
        commons: ['lodash', 'react', 'react-dom', 'ol']
    },
    output: {
        path: BUILD_DIR,
        filename: 'bundle.min.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                include: APP_DIR,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'commons.min.js'
        }),
        /*
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({sourceMap: true, minimize: true})
        */
    ],
    devtool: 'cheap-module-source-map'

};
module.exports = config;
