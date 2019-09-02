import { autoprefixer } from "./dom"

// 播放模式
export const MODE = {
	// 顺序
	ORDER: "0",
	// 单曲
	SINGLE: "1",
	// 随机
	RANDOM: "2"
}

// 通过 js 完成 autoprefixer 的任务（如果不是在 css 中写有兼容性问题的属性，不会被 autoprefixer 所编译）
export const transform = autoprefixer('transform')
export const filter = autoprefixer('filter')
