const path = require('path')
const webpack = require('webpack') // 用于访问内置插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
    // 入口
    entry: './src/index.js',
    // 出口
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new VueLoaderPlugin(),
        new HTMLPlugin({
            options: {
                favicon: false
            }
        })
    ],
    mode: 'none',
    module: {
        rules: [{
            // 使用vue-loader处理.vue文件
            test: /.vue$/,
            loader: 'vue-loader'
        }, {
            // 使用style-loader处理vue文件中的style标签里的css,或说是处理html中的style标签内的css
            // css-loader处理从外部引入的css文件
            test: /.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }, {
            // 对css预处理器scss的处理
            test: /.scss$/,
            loader: [
                'sass-loader',  // sass-loader依赖于node-loader
                'style-loader',
                'css-loader'
            ]
        }, {
            // 处理图片文件, 作用是将我们的图片转换成一个base64的字串存放于我们打包生成的js里面
            test: /\.(gif|jpg|jpeg|png|svg)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024, // 1024:将所有小于1kb的图片都转为base64
                    name: '[name].aaa.[ext]'
                }
            }]
        }]
    }
}

if(isDev) {
    config.devServer = {
        port: 8000,
        host: 'localhost',
        overlay: {
            erros: true  // 编译的过程中能够让任何的错误都显示到网页上面
        },
        open: true, // 自动打开浏览器
        hot: true // 热更新
    }

    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(), // 热更新插件
        new webpack.NoEmitOnErrorsPlugin()  // 不显示不必要的错误信息
    )
}

module.exports = config