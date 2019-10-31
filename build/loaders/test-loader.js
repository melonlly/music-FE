// const loaderUtils = require("loader-utils")

// 不能使用箭头函数
module.exports = function (content) {
	// console.log(`~~~~~~~~~~ ${ content }`)

	// 获取loader中传递的配置信息
	// const options = loaderUtils.getOptions(this);
	// console.log(options)

	const params = this.query // 配置参数
	// console.log(`######### ${ params.name }`)
	
	// 返回处理后的内容
	this.callback(null, '/* 增加一个注释 ~~~~~~~ */' + content);
	// 也可以直接return
	// return '/* 增加一个注释 ~~~~~~~ */' + content;
}