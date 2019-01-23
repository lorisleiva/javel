const path = require('path');
const pkg = require('./package.json');
const libraryName = pkg.name;

module.exports = env => ({
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-map' : 'eval-source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: libraryName + (env.production ? '.min.js' : '.js'),
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    // module: {
    //     rules: [
    //         {
    //             test: /(\.jsx|\.js)$/,
    //             loader: 'babel-loader',
    //             exclude: /(node_modules|bower_components)/
    //         },
    //         {
    //             test: /(\.jsx|\.js)$/,
    //             loader: 'eslint-loader',
    //             exclude: /node_modules/
    //         }
    //     ]
    // },
    // resolve: {
    //     modules: [path.resolve('./node_modules'), path.resolve('./src')],
    //     extensions: ['.json', '.js']
    // }
});