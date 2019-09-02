require("dotenv")

console.log(`=================================== 当前配置 start ==============================================`)
console.log(`当前环境 -> ${ process.env.NODE_ENV }`)
console.log(`是否需要生成打包报告 -> ${ process.env.need_report }`)
console.log(`=================================== 当前配置 end ================================================`)

module.exports = {
	devServer: {
		port: 8080,
		proxy: 'http://127.0.0.1:7777'
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

		if (process.env.need_report === "yes") {
			config.plugin('webpack-bundle-analyzer')
			.use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
		}
	}
}