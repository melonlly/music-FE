import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import actions from './actions'
import getters from './getters'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

// 当前运行环境
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    // 严格模式下，如果state不是由mutation函数修改的，则会抛出异常
    strict: debug,
    // 插件
    plugins: debug ? [createLogger()] : []
})
