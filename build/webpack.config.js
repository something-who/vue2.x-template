const path = require('path')
const webpack = require('webpack') // 用于访问内置插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

// 参考 https://gitee.com/Dandelion_/vue-webpack-scaffold

// 是否是开发环境
// process.env拿到的是一个对象，它的属性可以通过命令行参数传入
// 这个NODE_ENV就是从package.json的dev/build scripts传进来的
const mode = process.env.NODE_ENV
const isDev = mode === 'development'

const config = {
    // 指定webpack模式
    mode: mode,
    // 入口
    // entry: path.resolve(__dirname, '../src/index.js'),
    entry: './src/index.js',
    // 出口
    output: {
        /**
         * hash跟chunkhash的区别，如果entry有多个，或者需要单独打包类库到
         * 一个js文件的时候，hash是所有打包出来的每个js文件都是同样的哈希，
         * 而chunkhash就是只是那个chunk的哈希，也就是chunkhash如果那个chunk
         * 没有变化就不会变，而hash只要某一个文件内容有变化都是不一样的，所以
         * 用chunkhash区分开每一个文件有变化时才更新，让浏览器起到缓存的作用
         */
        filename: isDev ? 'bundle.[hash:8].js' : '[name].[chunkhash:8].js',
        path: path.resolve(__dirname, '../dist')
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: isDev ? '"development"' : '"production"'
        //     }
        // }),
        // 配置vue-loader插件
        new VueLoaderPlugin(),
        new HTMLPlugin({
            filename: 'index.html', // 生成的文件名称
            favicon: false,  // 是否加载favicon
            template: './public/index.html',  // 指定模板
            inject: 'body',  // 指定插入script标签在body底部
            // 压缩index.html
            minify: {
                collapseWhitespace: true
            }
        }),
        // 清除dist文件夹下的文件，保留新文件
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [{
            // 使用vue-loader解析.vue文件
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            // 处理图片文件, 作用是将我们的图片转换成一个base64的字串存放于我们打包生成的js里面
            test: /\.(gif|jpg|jpeg|png|svg)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024, // 1024:将所有小于1kb的图片都转为base64编码的dataurl,否则返回普通的图片
                    name: 'assets/images/[name].[hash:5].[ext]' // 图片打包到哪的路径
                }
            }]
        }, {
            test: /\.js/,
            // exclude 需要忽略的文件或文件夹下的文件，反之，include
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    // 服务器需要跨域，使用代理解决，以下为代理配置
    // 配置 webpack-dev-server、express
    // devServer: {
    //     host: 'localhost',
    //     port: 9999,
    //     proxy: {
    //         // 使用this.$ajax.get('/p1/xxxx')，以/p1开头
    //         '/p1/': {
    //             changeOrigin: true,
    //             target: 'https://api.baidu.com/'
    //         }
    //     }
    // }
}

// 开发环境和生产环境下的差异化配置
if(isDev) {
    // 开发环境下的配置

    // rules-css相关
    config.module.rules.push({
        test: /\.css$/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                }
            },
            'postcss-loader'
        ]
    }, {
        // 对scss的处理
        test: /\.scss$/,
        use: [
            // 特别注意顺序
            // 处理顺序是从sass-loader到style-loader
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'sass-loader'
        ]
        // loader: [
        //     'style-loader',
        //     'css-loader',
        //     'sass-loader'
        // ]
    })

    // 开发环境服务器信息配置
    config.devServer = {
        // contentBase: path.join(__dirname, 'dist'),
        port: 8000,
        host: '0.0.0.0', // 配置成0.0.0.0的话通过ip，localhost都能访问
        overlay: {
            erros: true  // 编译的过程中，让任何的错误都显示到网页上面
        },
        open: false, // 自动打开浏览器
        hot: true // 热更新
    }

    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(), // 热更新插件
        new webpack.NoEmitOnErrorsPlugin()  // 不显示不必要的错误信息
    )

    // 生成source map，方便调试
    // https://webpack.docschina.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx
    config.devtool = 'cheap-eval-source-map'
} else {
    // 生产环境下的配置

    // 把css分离打包到单独的文件
    config.module.rules.push({
        test: /\.css$/,
        use: [
            // 使用的mini-css-extract-plugin插件实现将*.css从构建生成的js文件中分离出来
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                }
            },
            'postcss-loader'
        ]
    }, {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'sass-loader'
        ]
    })

    config.plugins.push(
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "styles/style.[hash:8].css",
            chunkFilename: "styles/style.[hash:8].css"
        })
    )

    // 单独打包第三方类库文件（比如vue框架）
    config.optimization = {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
        runtimeChunk: {
            name: entrypoint => `runtimechunk~${entrypoint.name}`
        }
    }
}

module.exports = config