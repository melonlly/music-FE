/**
 * 定义所有的行为（actions）
 *   当有同时有多个state需要更新，则可定义一个action来统一提交
 */

import types from './mutation-types'
import { shuffle, getIndex } from '../utils/utils'
import { MODE } from '../utils/constants'

export default {
	/**
     * 选择歌曲开始播放
     *  1.设置歌曲列表和歌曲播放队列（列表为全集，队列会根据播放模式而改变）
     *  2.设置播放状态
     *  3.设置是否全屏
     *  4.设置当前播放歌曲在播放队列中的位置
     */
	selectSong({commit, state}: any, {list, index}: any) {
        let sequenceList = []
        // 1
        commit(types.SET_SONGLIST, list)
        switch (state.mode) {
            // 列表循环
            case MODE.ORDER: {
                sequenceList = list
                break
            }
            // 单曲循环
            case MODE.SINGLE: {
                sequenceList = list
                break
            }
            // 随机播放
            case MODE.RANDOM: {
                const randomList = shuffle(list)
                index = getIndex(randomList, list[index])
                sequenceList = randomList
                break
            }
            default: {
                sequenceList = list
                break
            }
        }
        commit(types.SET_SEQUENCELIST, sequenceList)
        // 2
        commit(types.SET_PLAYING, true)
        // 3
        commit(types.SET_FULLSCREEN, true)
        // 4
        commit(types.SET_CURRENTINDEX, index)
    }
}
