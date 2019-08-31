/**
 * 所有存储的数据（state）
 */

import config from '../config'

export default {
	// 当前查看的歌手信息
    singer: {},
    // 是否在播放
    playing: false,
    // 是否全屏
    fullScreen: false,
    // 播放模式（列表循环：0，单曲循环：1，随机播放：2）
    mode: config.mode,
    // 歌单列表
    songList: [],
    // 播放队列
    sequenceList: [],
    // 当前播放在队列中的位置
    currentIndex: -1,
    // 当前查看的排行榜信息
    rank: {},
    // 是否正在查看播放列表
    isShowList: false,
    // 是否显示登录页
    login: false
}
