var path = require('path');
var dotenv = require('dotenv');

dotenv.config();

var CleanWebpackPlugin = require('clean-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = [
    {
        name: 'production',
        entry: path.resolve(__dirname, 'src/index.ts'),
        target: 'node',
        mode: process.env.NODE_ENV,
        output: {
            filename: 'app.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'commonjs'
        },
        resolve: {
            extensions: ['.ts', '.js'],
            modules: ['node_modules']
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    },
                    exclude: /node_modules/
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path.resolve(__dirname, 'tsconfig.json'),
                tslint: path.resolve(__dirname, 'tslint.json')
            })
        ]
    }
];
