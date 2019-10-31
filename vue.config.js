require("dotenv")

const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);

// 去除console
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 压缩css、js
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 要压缩的文件
const productionGzipExtensions = ['js', 'css'];

console.log(`=================================== 当前配置 start ==============================================`)
console.log(`当前环境 -> ${ process.env.NODE_ENV }`)
console.log(`是否需要生成打包报告 -> ${ process.env.need_report }`)
console.log(`=================================== 当前配置 end ================================================`)

module.exports = {
	devServer: {
		port: 8080,
		// proxy: 'http://127.0.0.1:7777'
		proxy: 'http://47.98.146.215:7777'
	},
	configureWebpack: config => {
		// 如果不是开发环境
        if (process.env.NODE_ENV !== 'development') {
            // 代码压缩
            config.plugins.push(new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`),
                threshold: 10240,
                minRatio: 0.8,
            }));

            // 打包后清除断点和控制台打印
            config.plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            drop_debugger: true, // 注释debugger
                            drop_console: true, // 注释console
                            pure_funcs:['console.log'] // 移除console
                        },
                    },
                    sourceMap: false,   // 去除打包后生成的.map文件
                    parallel: true,
                }),
            );
        }
	},
	chainWebpack: config => {
		config
			.resolve
			.alias
			.set('components', '@/components')
			.set('assets', '@/assets')
			.set('views', '@/views')
			.set('plugins', '@/plugins')
			.set('utils', '@/utils')

		// 自定义 test-loader
		config
			.module
				.rule('scss')
				.test(/\.scss$/)
					.use('test')
						.loader(resolve('./build/loaders/test-loader.js'))
							.options({
								name: 'test'
							})
		
		// 自定义 test-plugin
		config
			.plugin('test')
				.use(require('./build/plugins/test-plugin'))

		config.when(process.env.need_report === "yes", config => {
			config
				.plugin('webpack-bundle-analyzer')
					.use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
		})

	},
}