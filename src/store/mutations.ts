/**
 * 与getters相对于的setters，修改state中的值
 */

import types from './mutation-types'

export default {
	[types.SET_SINGER](state: any, singer: {}) {
		state.singer = singer
	},
	[types.SET_PLAYING](state: any, playing: boolean) {
		state.playing = playing
	},
	[types.SET_FULLSCREEN](state: any, fullScreen: boolean) {
		state.fullScreen = fullScreen
	},
	[types.SET_MODE](state: any, mode: string) {
		state.mode = mode
	},
	[types.SET_SONGLIST](state: any, songList: []) {
		state.songList = songList
	},
	[types.SET_SEQUENCELIST](state: any, sequenceList: []) {
		state.sequenceList = sequenceList
	},
	[types.SET_CURRENTINDEX](state: any, currentIndex: number) {
		state.currentIndex = currentIndex
	},
	[types.SET_RANK](state: any, rank: {}) {
		state.rank = rank
	},
	[types.SET_ISSHOWLIST](state: any, isShowList: boolean) {
		state.isShowList = isShowList
	},
	[types.SET_LOGIN](state: any, login: boolean) {
		state.login = login
	}
}
