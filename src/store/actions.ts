/**
 * 定义所有的行为（actions）
 *   当有同时有多个state需要更新，则可定义一个action来统一提交
 */

import { 
    SET_SEQUENCELIST,
    SET_PLAYING,
    SET_FULLSCREEN,
    SET_CURRENTINDEX
 } from './mutation-types'

export default {
	/**
     * 选择歌曲开始播放
     *  1.将当前歌曲添加至播放队列（若已存在，则不添加），设置当前播放歌曲在播放队列中的位置
     *  2.设置播放状态
     *  3.设置是否全屏
     */
	selectSong({commit, state}: any, {song}: any) {
        // 1
        const sequenceList = state.sequenceList.slice()
        let index = 0
        for (let i = 0; i < sequenceList.length; i++) {
            const seq = sequenceList[i];
            if (seq.songid === song.songid) {
                index = i
                break
            }
        }
        if (index === 0) {
            // 未找到匹配歌曲
            sequenceList.push(song)
            commit(SET_SEQUENCELIST, sequenceList)
            index = sequenceList.length - 1
        }
        // console.log(`当前index -> ${ index }`)
        // console.log(sequenceList)
        commit(SET_CURRENTINDEX, index)
        // 2
        commit(SET_PLAYING, true)
        // 3
        commit(SET_FULLSCREEN, true)
    }
}
