<template>
    <div class="search">
        <div class="search-wrapper" ref="searchWrapper">
            <div class="search-box" ref="searchBox">
                <form action @submit.prevent>
                    <input
                        v-focus
                        type="search"
                        autocomplete="off"
                        autocorrect="off"
                        placeholder="搜索歌曲、歌手"
                        @keyup.enter="onenter"
                        @focus="onfocus"
                        @blur="onblur"
                        ref="input"
                    />
                </form>
                <span class="cancel" v-show="isInput" @click="cancel">取消</span>
            </div>
            <div class="content-wrapper" ref="contentScroller" v-show="songs.length === 0">
                <scroller class="search-content" :dataList="songs">
                    <div class="hot" v-show="!searchNull">
                        <div class="title">热门搜索</div>
                        <div class="keys">
                            <span
                                v-for="(key, index) in hotKeys"
                                :key="index"
                                :class="{ special: index === 0 }"
                                @click="onenter('', key)"
                            >{{ key }}</span>
                        </div>
                    </div>
                    <div class="history" v-show="history.length > 0 && !searchNull">
                        <div class="title">
                            搜索历史
                            <span
                                class="del"
                                v-show="history.length > 0"
                                @click="cleanHistory()"
                            >清除搜索记录</span>
                        </div>
                        <div class="text">
                            <span
                                v-for="(his, index) in history"
                                :key="index"
                                @click="onenter('', his)"
                            >{{ his }}</span>
                        </div>
                    </div>
                </scroller>
            </div>
            <!-- 查询列表 -->
            <div class="result-wrapper" v-show="songs.length > 0" ref="resultWrapper">
                <scroller
                    class="result-list"
                    v-if="songs.length > 0"
                    :pullUpLoad="true"
                    @onpullingUp="loadPage"
                    ref="resultScroller"
                    :dataList="songs"
                >
                    <div class="zhida" v-if="zhida && zhida.type !== 0" @click="zhidaDetail">
                        <span class="avatar">
                            <img v-lazy="getZhidaInfo.url" />
                        </span>
                        <h6 class="title">{{ getZhidaInfo.title }}</h6>
                        <p class="sub-info" v-if="zhida.type === 3">{{ zhida.singername }}</p>
                        <p class="sub-info" v-if="zhida.type === 2">
                            <span>单曲：{{ zhida.songnum }}</span>
                            <span>专辑：{{ zhida.albumnum }}</span>
                        </p>
                    </div>
                    <ul class="song-list">
                        <li
                            class="song"
                            v-for="(song, index) in songs"
                            :key="index"
                            @click="select(song, index)"
                        >
                            <h6 class="title">{{ song.songname }}</h6>
                            <p class="sub-info">{{ song.singer[0].name }}</p>
                        </li>
                    </ul>
                </scroller>
            </div>
            <div class="search-null" v-show="searchNull">
                <h3>无匹配</h3>
                <p>很抱歉，没有找到与“{{ text }}”相关的结果。</p>
            </div>
        </div>

        <!-- 歌手详情页 -->
        <transition name="slide">
            <router-view v-if="singer.singer_mid"></router-view>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
    removeItem,
    getRandomItem,
    getZhidaPic2,
    getZhidaPic3,
    goto
} from "@/utils/utils";
import Scroller from "@/components/Scroller.vue";
import { Getter, Mutation, Action } from "vuex-class";

const HOT_KEY_SUM = 10; // 随机key个数

@Component({
    name: "Search",
    components: {
        Scroller
    }
})
export default class Search extends Vue {
    text: string = ""; // 当前查询的关键字
    flag: boolean = false; // 是否正在查询
    hotKeys: Array<string> = [];
    special: any = {};
    history: Array<string> = []; // 历史搜索
    songs: Array<any> = [];
    zhida: any = {};
    page: number = 1; // 当前页数
    totalPage: number = 0; // 总页数
    isInput: boolean = false; // 是否正在输入
    searchNull: boolean = false; // 是否未查询到信息
    @Getter("getSinger") singer!: any;
    @Mutation("SET_SINGER") setSinger!: (singer: any) => void;
    @Action("selectSong") selectSong!: (payload: any) => void;

    private get getZhidaInfo() {
        let picUrl = "";
        let title = "";
        const zhida = this.zhida;
        switch (zhida.type) {
            case 2:
                picUrl = getZhidaPic2(zhida.singermid);
                title = zhida.singername;
                break;
            case 3:
                picUrl = getZhidaPic3(zhida.albummid);
                title = zhida.albumname;
                break;
            default:
                break;
        }
        return {
            url: picUrl,
            title
        };
    }

    created() {
        this._getHotKeys();
        this._getSearchHistory();

        this.$nextTick(() => {
            const searchBoxH = (this.$refs.searchBox as HTMLElement)
                .clientHeight;
            const searchWrapperH = (this.$refs.searchWrapper as HTMLElement)
                .clientHeight;
            (this.$refs
                .resultWrapper as HTMLElement).style.height = `${searchWrapperH -
                searchBoxH -
                20}px`;
            (this.$refs
                .contentScroller as HTMLElement).style.height = `${searchWrapperH -
                searchBoxH -
                20}px`;
        });
    }

    // 重新被激活时触发
    activated() {
        (this.$refs.input as any).focus();
    }

    private onenter(e: any, words: string) {
        const text = e ? e.target.value : words;
        this.search(text);
        if (text) {
            let his = window.localStorage.getItem("search_history") || "";
            if (his) {
                if (his.indexOf(text) < 0) {
                    his += `,${text}`;
                }
            } else {
                his = text;
            }
            window.localStorage.setItem("search_history", his);
            this._getSearchHistory();
        }

        (this.$refs.input as any).focus();
    }
    private onfocus() {
        this.isInput = true;
    }
    private onblur() {
        this.isInput = false;
    }
    // 取消查询
    private cancel() {
        (this.$refs.input as any).value = "";
        (this.$refs.input as any).blur();

        this.isInput = false;
        this.text = "";
        this.songs = [];
        this.zhida = "";
        this.page = 1;
        this.searchNull = false;
    }
    // 查询
    private search(text: string) {
        if (this.flag) return;
        this.flag = true;
        this.text = text || "";
        (this.$refs.input as any).value = this.text;
        this.$axios
            .get(`/search/searchList`, {
                params: {
                    key: text,
                    page: this.page
                }
            })
            .then(res => {
                this.flag = false;
                if (res.status === this.$OK) {
                    const list = res.data.song.list;
                    list.forEach((song: any) => {
                        song.album = {
                            id: song.albumid,
                            mid: song.albummid,
                            name: song.albumname
                        };
                        song.name = song.songname;
                        song.singer_name = song.singer[0].name;
                    });
                    if (this.page === 1) {
                        this.songs = list;
                    } else {
                        this.songs = this.songs.concat(list);
                    }
                    this.totalPage = Math.ceil(res.data.song.totalnum / 20);
                    this.zhida = res.data.zhida;
                    if (
                        (!this.songs && !this.zhida) ||
                        (!this.zhida.singermid && this.songs.length === 0)
                    ) {
                        this.searchNull = true;
                    }

                    if (this.$refs.resultScroller) {
                        // 数据加载完成后，通知完成当次上拉动作
                        (this.$refs.resultScroller as Scroller).finishPullUp();
                    }
                } else {
                    this.searchNull = true;
                }
            })
            .catch(err => {
                this.flag = false;
                throw err
            });
    }
    // 查询下一页
    private loadPage() {
        if (this.page === this.totalPage) {
            return false;
        } else {
            this.page = this.page + 1;
            this.search(this.text);
        }
    }
    // 清除搜索历史
    private cleanHistory() {
        this.history = [];
        window.localStorage.setItem("search_history", "");
    }
    private zhidaDetail() {
        const zhida = this.zhida;
        // 歌手
        if (zhida && zhida.type === 2) {
            // 跳转歌手详情页
            goto(this.$router, {
                path: `/singer/${zhida.singermid}`
            })
            // 保存当前歌手信息
            this.setSinger({
                singer_mid: zhida.singermid,
                singer_name: zhida.singername
            });
        } else {
            // 其他（专辑、topic等）
        }
    }
    // 选择歌曲
    private select(song: any, index: number) {
        this.selectSong({ song });
    }
    // 获取热门搜索
    private _getHotKeys() {
        this.$axios.get("/hot/key/", {}).then(res => {
            if (res.status === this.$OK) {
                const data = res.data;
                this.hotKeys = data.hotkey;
                this.special.key = data.special_key;
                this.special.url = data.special_url;
                this._getRandomKeys();
            }
        });
    }
    // 随机获取一些key（第一个必须为特殊key）
    private _getRandomKeys() {
        const key = this.special.key;
        const randomList = [];
        const len = this.hotKeys.length;
        if (len > 0) {
            randomList.push(key);
            for (let i = 0; i < HOT_KEY_SUM; i++) {
                if (this.hotKeys.length > 0) {
                    const randomItem = getRandomItem(this.hotKeys);
                    removeItem(this.hotKeys, "k", randomItem.k);
                    randomList.push(randomItem.k);
                } else {
                    break;
                }
            }
        }
        this.hotKeys = randomList;
	}
	// 查询搜索历史
    private _getSearchHistory() {
        const his = window.localStorage.getItem("search_history");
        if (his) {
            this.history = his.split(",");
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.search {
    .search-wrapper {
        position: relative;
        padding: 10px;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
        .search-box {
            position: relative;
            border-radius: 3px;
            background: #f4f4f4;
            height: 30px;
            padding: 8px 12px 8px 40px;
            margin-bottom: 10px;
            input {
                width: 100%;
                height: 30px;
                line-height: 30px;
                background: #f4f4f4;
                color: rgba(0, 0, 0, 0.3);
                outline: none;
                border: none;
                /* 针对ios 设置样式, 去除ios下input 椭圆形 */
                -webkit-appearance: none;
                /* 去除默认的 X */
                &::-webkit-search-cancel-button {
                    display: none;
                }
            }
            .cancel {
                position: absolute;
                right: 10px;
                top: 0;
                height: 100%;
                line-height: 46px;
                font-size: $font-size-S;
                color: $default-light-color;
            }
            &:before {
                content: " ";
                position: absolute;
                top: 11.5px;
                left: 9px;
                width: 23px;
                height: 23px;
                background: url("~assets/images/search.png");
                background-size: cover;
                background-position: center;
            }
        }
        .content-wrapper {
            overflow: hidden;
            .hot {
                .title {
                    height: 10%;
                    padding: 20px;
                }
                .keys {
                    padding: 0 20px;
                    font-size: $font-size-S;
                    span {
                        display: inline-block;
                        padding: 8px;
                        margin-bottom: 10px;
                        margin-right: 10px;
                        border-radius: 8px;
                        background: rgb(51, 51, 51);
                        &.special {
                            color: $default-light-color;
                        }
                    }
                }
            }
            .history {
                .title {
                    height: 10%;
                    padding: 20px;
                    .del {
                        float: right;
                        font-size: $font-size-XS;
                        color: $default-light-color;
                    }
                }
                .text {
                    padding: 0 20px;
                    font-size: $font-size-S;
                    span {
                        display: inline-block;
                        padding: 8px;
                        margin-bottom: 10px;
                        margin-right: 10px;
                        border-radius: 8px;
                        background: rgb(51, 51, 51);
                    }
                }
            }
        }
        .result-wrapper {
            overflow: hidden;
            .result-list {
                .zhida {
                    position: relative;
                    height: 55px;
                    padding-left: 65px;
                    overflow: hidden;
                    .avatar {
                        position: absolute;
                        top: 8px;
                        left: 8px;
                        width: 40px;
                        height: 40px;
                        img {
                            display: block;
                            width: 100%;
                        }
                    }
                    .title {
                        margin: 10px 0 2px;
                        line-height: 18px;
                        font-size: $font-size-M;
                        font-weight: 400;
                    }
                    .sub-info {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: $font-size-XS;
                        span {
                            margin-right: 10px;
                        }
                    }
                }
                .song-list {
                    .song {
                        position: relative;
                        height: 55px;
                        padding-left: 65px;
                        overflow: hidden;
                        .title {
                            margin: 10px 0 2px;
                            line-height: 18px;
                            font-size: $font-size-M;
                            font-weight: 400;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                        .sub-info {
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            font-size: $font-size-XS;
                        }
                        &:before {
                            content: " ";
                            position: absolute;
                            top: 8px;
                            left: 8px;
                            width: 40px;
                            height: 40px;
                            background-image: url("~assets/images/note.png");
                            background-size: contain;
                            background-position: center;
                            background-repeat: no-repeat;
                        }
                    }
                }
            }
        }
        .search-null {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 200px 0 0;
            text-align: center;
            &:before {
                content: " ";
                position: absolute;
                width: 100px;
                height: 100px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-image: url("~assets/images/search_null_melon.png");
                background-size: cover;
            }
        }
    }
    .slide-enter-active,
    .slide-leave-active {
        transition: all 0.3s;
    }
    .slide-enter,
    .slide-leave {
        transform: translate3d(100%, 0, 0);
    }
}
</style>
