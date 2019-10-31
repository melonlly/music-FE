class TestPlugin {
	// apply方法，会在new plugin后被webpack自动执行
	apply(compiler) {
		// 可以在任意的钩子函数中去触发自定义事件，也可以监听其他事件：compiler.hooks.xxx
		compiler.hooks.compilation.tap('TestPlugin', compilation => {
			compilation.hooks.afterOptimizeChunkAssets.tap('APlugin', chunks => {
				const names = []
				chunks.forEach(chunk => {
					names.push(chunk.name)
				})
				// 这里只是简单的打印了chunks
				console.log('打印chunks：', names.join(','));
			});
		})
	}
}

module.exports = TestPlugin