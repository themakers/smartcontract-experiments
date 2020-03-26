const path = require('path')

const resolve = (...ps) => {
    return path.resolve(__dirname, ...ps)
}

// TODO ??? https://github.com/TypeStrong/fork-ts-checker-webpack-plugin

module.exports = {
    mode: 'development',
    target: 'node',
    entry: {
        'simulation': resolve('src/simulation.js')
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: [/\.ts$/],
                use: {
                    loader: 'ts-loader',
                    options: {
                        logLevel: 'info',
                        context: resolve(),
                        configFile: resolve('tsconfig.json'),
                        allowTsInNodeModules: true
                    },
                },
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: resolve('dist')
    }
}
