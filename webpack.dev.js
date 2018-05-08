var path = require('path');
var webpack = require('webpack');

var config = {
    context: path.join(__dirname, ''),
    devtool: 'source-map',
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
        path.join(__dirname, '/app/app.js'),
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js']
    },
    resolveLoader: {
        moduleDirectories: ['node_modules'],
        moduleTemplates: ['*-loader', '*'],
        extensions: ['', '.js']
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
        // inside your code for any environment checks; UglifyJS will automatically
        // drop any unreachable code.
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader',
            },
            {
                test: /\.(jpg|png|gif)$/,
                loaders: [
                    'file-loader',
                    'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
                ],
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                include: /\.json$/,
                loaders: ['json-loader']
            }
        ]
    },
    stats: false, // Don't show stats in the console
    progress: true,
};

module.exports = config;