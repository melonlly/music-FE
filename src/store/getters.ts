import { State } from './state'

/**
 * 定义所有的获取state中值的入口（getters）
 */
const getSinger = (state: State) => state.singer
const getPlaying = (state: State) => state.playing
const getFullScreen = (state: State) => state.fullScreen
const getMode = (state: State) => state.mode
const getSequenceList = (state: State) => state.sequenceList
const getCurrentIndex = (state: State) => state.currentIndex
const getCurrentSong = (state: State) => state.sequenceList[state.currentIndex] || {}
const getRank = (state: State) => state.rank
const getIsShowList = (state: State) => state.isShowList
const getUserInfo = (state: State) => state.userinfo
const getShowLogin = (state: State) => state.showLogin
const getTo = (state: State) => state.to
const getFrom = (state: State) => state.from

export default {
    getSinger,
    getPlaying,
    getFullScreen,
    getMode,
    getSequenceList,
    getCurrentIndex,
    getCurrentSong,
    getRank,
    getIsShowList,
    getUserInfo,
    getShowLogin,
    getTo,
    getFrom,
}
