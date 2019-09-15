/**
 * 与getters相对于的setters，修改state中的值
 */

import { 
	SET_SINGER,
	SET_CURRENTINDEX,
	SET_FULLSCREEN,
	SET_ISSHOWLIST,
	SET_MODE,
	SET_PLAYING,
	SET_SEQUENCELIST,
	SET_RANK,
	SET_SHOWLOGIN,
	SET_SONGLIST,
	SET_TO,
	SET_USERINFO,
	SET_FROM,
 } from './mutation-types'
import { State } from './state'

export default {
	[SET_SINGER](state: State, singer: {}) {
		state.singer = singer
	},
	[SET_PLAYING](state: State, playing: boolean) {
		state.playing = playing
	},
	[SET_FULLSCREEN](state: State, fullScreen: boolean) {
		state.fullScreen = fullScreen
	},
	[SET_MODE](state: State, mode: string) {
		state.mode = mode
	},
	[SET_SONGLIST](state: State, songList: []) {
		state.songList = songList
	},
	[SET_SEQUENCELIST](state: State, sequenceList: []) {
		state.sequenceList = sequenceList
	},
	[SET_CURRENTINDEX](state: State, currentIndex: number) {
		state.currentIndex = currentIndex
	},
	[SET_RANK](state: State, rank: {}) {
		state.rank = rank
	},
	[SET_ISSHOWLIST](state: State, isShowList: boolean) {
		state.isShowList = isShowList
	},
	[SET_USERINFO](state: State, userinfo: any) {
		state.userinfo = userinfo
	},
	[SET_SHOWLOGIN](state: State, showLogin: boolean) {
		state.showLogin = showLogin
	},
	[SET_TO](state: State, to: string) {
		state.to = to
	},
	[SET_FROM](state: State, from: string) {
		state.from = from
	}
}
