module.exports = {
	configureWebpack: {
		resolve: {
			alias: {
				'components': '@/components',
				'assets': '@/assets',
				'views': '@/views',
				'plugin': '@/plugin',
				'utils': '@/utils',
			}
		}
	}
}