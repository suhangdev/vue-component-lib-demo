const path = require('path')
module.exports = {
    lintOnSave: false,
    // 输出目录
    outputDir: 'dist',
    // 静态资源存放目录
    assetsDir: './static',
    // 是否开启文件hash
    filenameHashing: true,
    // sourceMap
    productionSourceMap: false,
    devServer: {
        host: "localhost",
        port: 3000,
        hot: true,
        compress: true,
        hotOnly: true,
        open: false,
        https: false,
        overlay: {
            warning: false,
            error: true
        },
        public: "0.0.0.0:3000"
    },
    // 多页配置
    pages: {
        index: {
            entry: 'example/main.ts',
            template: 'example/index.html',
            filename: 'index.html'
        }
    },
    css: { extract: false },
    configureWebpack: {
        output: {
            libraryExport: 'default'
        },
    },
    // 插件选项
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                path.resolve(__dirname, './packages/common/style/common.less')
            ]
        }
    },
    // webpack配置项
    chainWebpack: config => {
        config.externals({
            'vue': 'Vue'
        })
    }
}