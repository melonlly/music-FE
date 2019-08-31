/**
 * 定义所有的获取state中值的入口（getters）
 */
const getSinger = (state: any) => state.singer
const getCurrent = (state: any) => state.current
const getPlaying = (state: any) => state.playing
const getFullScreen = (state: any) => state.fullScreen
const getMode = (state: any) => state.mode
const getSongList = (state: any) => state.songList
const getSequenceList = (state: any) => state.sequenceList
const getCurrentIndex = (state: any) => state.currentIndex
const getCurrentSong = (state: any) => state.songList[state.currentIndex] || {}
const getRank = (state: any) => state.rank
const getIsShowList = (state: any) => state.isShowList
const getLogin = (state: any) => state.login

export default {
    getSinger,
    getCurrent,
    getPlaying,
    getFullScreen,
    getMode,
    getSongList,
    getSequenceList,
    getCurrentIndex,
    getCurrentSong,
    getRank,
    getIsShowList,
    getLogin
}
