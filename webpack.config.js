const path = require('path')
const pkg = require('./package.json')
const libraryName = pkg.name

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
    externals: {
        mixwith: 'mixwith',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    'eslint-loader',
                ],
            },
        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@utils': path.resolve(__dirname, 'src/utils'),
        },
    }
})