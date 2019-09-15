<template>
    <div class="rank-detail" ref="detail">
        <back @back="_back"></back>
        <div class="title">{{ title }}</div>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="filter" ref="filter"></div>
            <div class="update" ref="update">更新时间：{{ update }}</div>
        </div>

        <div class="bg-layer" ref="layer"></div>

        <scroller
            class="detail-content"
            ref="content"
            @onscroll="onscroll"
            :listen-scroll="$nRpsPty.listenScroll"
            :probe-type="$nRpsPty.probeType"
            :dataList="songs"
        >
            <div
                class="song"
                v-for="(song, index) in songs"
                :key="index"
                @click="select(song, index)"
            >
                <div class="rank">
                    <span :class="getRankStyle(index)">{{ index + 1 }}</span>
                    <span class="change">
                        <svg class="icon_svg">
                            <use :href="getIconByType(song.rankType)" />
                        </svg>
                        {{ song.rankValue }}
                    </span>
                </div>
                <div class="song-info">
                    <h3 class="name">{{ song.title }}</h3>
                    <p class="desc">{{ song.singerName }}</p>
                </div>
            </div>
        </scroller>

        <!-- loading -->
        <loading v-show="!songs.length"></loading>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Loading from "@/components/Loading.vue";
import Scroller from "@/components/Scroller.vue";
import Back from "@/components/Back.vue";
import { transform, filter } from "@/utils/constants";
import { Getter, Action } from "vuex-class";

const minHeaderHeight = 40; // 最小标题高度

@Component({
    name: "RankDetail",
    components: {
        Loading,
        Scroller,
        Back
    }
})
export default class RankDetail extends Vue {
    // 标题
    title: string = "";
    // 更新时间
    update: string = "";
    // 榜单歌曲
    songs: Array<any> = [];
    // 垂直滚动的位置
    scrollY: number = 0;
    @Getter("getRank") rank!: any;
    @Action("selectSong") selectSong!: (payload: any) => void;

    private get bgStyle() {
        return `background-image:url(${this.rank.picUrl})`;
    }

    @Watch("scrollY")
    onScrollYChange(newY: number) {
        const translateY = newY * -1; // 滚动距离
        let zIndex = "0";
        let scale = 1;
        let blur = 0;

        const percent = Math.abs(newY / this.$nRpsPty.top);
        if (newY > 0) {
            // scrollTop为0时，向下拉动
            scale = 1 + percent;
            zIndex = "10";
        } else {
            // 向上拉动
            blur = Math.min(20, percent * 20);
        }

        const $update = this.$refs.update as HTMLElement;
        const $bgImage = this.$refs.bgImage as HTMLElement;
        $update.style.display = "";
        if (translateY <= this.$nRpsPty.maxTranslateY) {
            ((this.$refs.layer as HTMLElement).style as any)[
                transform
            ] = `translate3d(0, -${translateY}px, 0)`;
            $bgImage.style.paddingTop = `70%`;
        } else {
            zIndex = "10";
            blur = 0;
            $bgImage.style.paddingTop = `${minHeaderHeight}px`;
            // this.$refs.playBtn.style.display = 'none'
            $update.style.display = "none";
        }
        ($bgImage.style as any)[filter] = `blur(${blur}px)`;
        ($bgImage.style as any)[transform] = `scale(${scale})`;
        $bgImage.style.zIndex = zIndex;
    }

    created() {
        this.$nRpsPty.probeType = 3; // 滚动类型
        this.$nRpsPty.listenScroll = true; // 是否监听滚动

        this.$nRpsPty.rankData = undefined; // 当前榜单数据

        this._getRankDetail();
    }
    mounted() {
        this.$nRpsPty.top = (this.$refs.bgImage as HTMLElement).clientHeight;
        ((this.$refs.content as Vue)
            .$el as HTMLElement).style.top = `${this.$nRpsPty.top}px`;
        // 最大滚动距离
        this.$nRpsPty.maxTranslateY = this.$nRpsPty.top - minHeaderHeight;
    }

    // 获取排行样式
    private getRankStyle(index: number) {
        if (index < 3) {
            return "index light";
        } else {
            return "index";
        }
    }
    // 根据类型获取 icon
    private getIconByType(type: number) {
        let icon = "";
        switch (type) {
            case 1:
                icon = "#icon_rank_up";
                break;
            case 2:
                icon = "#icon_rank_down";
                break;
            case 3:
                icon = "#icon_rank_invariant";
                break;
            case 4:
                icon = "#icon_rank_new";
                break;
            case 6:
                icon = "#icon_rank_surge";
                break;
            default:
                icon = "";
                break;
        }
        return icon;
    }
    // 获取排行详情
    private _getRankDetail() {
        const id = this.rank.id;
        if (!id) {
            this._back();
        } else {
            // 获取榜单详细信息
            this.$axios.get(`/rank/${id}`).then(res => {
                if (res.status === this.$OK) {
                    this.$nRpsPty.rankData = res.data;
                    if (res.data.toplistData) {
                        const toplistData = res.data.toplistData;
                        this.songs = toplistData.song;
                        this.title = toplistData.titleShare;
                        this.update = toplistData.updateTime;
                    } else {
                        this.songs = [];
                    }
                } else {
                    this.songs = [];
                }
                if (this.songs.length === 0) {
                    this._back();
                }
            });
        }
    }
    // 监听滚动条
    private onscroll(pos: any) {
        this.scrollY = pos.y;
    }
    // 返回
    private _back() {
        this.$router.back();
    }
    private select(song: any, index: number) {
        let songList = [];
        if (this.$nRpsPty.rankData) {
            if (
                this.$nRpsPty.rankData.songInfoList &&
                this.$nRpsPty.rankData.songInfoList.length > 0
            ) {
                songList = this.$nRpsPty.rankData.songInfoList;
            }
        }
        songList.forEach((s: any, i: number) => {
            s.singer_name = this.songs[i].singerName;
        });
        this.selectSong({
            list: songList,
            index
        });
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.rank-detail {
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: $background-color;
    .back {
        width: 32px;
        height: 32px;
        @include bg-image("~assets/images/back");
        transform: rotate(0);
    }
    .title {
        position: absolute;
        z-index: 40;
        left: 10%;
        top: 5px;
        width: 80%;
        height: 40px;
        @include no-wrap();
        text-align: center;
        line-height: 40px;
        font-size: $font-size-L;
        color: $default-light-color;
    }
    .bg-image {
        position: relative;
        width: 100%;
        padding-top: 70%;
        transform-origin: top;
        background-size: cover;
        background-position: center;
        .filter {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(7, 17, 27, 0.4);
            filter: blur(1px);
        }
        .update {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 36px;
            line-height: 36px;
            text-align: center;
            color: $default-light-color;
        }
    }
    .bg-layer {
        position: relative;
        height: 100%;
        background: $background-color;
    }
    .detail-content {
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        bottom: 0;
        padding: 0 10px 30px 10px;
        box-sizing: border-box;
        background: $background-color;
        .song {
            display: flex;
            margin-top: 30px;
            .rank {
                width: 15%;
                .index {
                    display: block;
                    text-align: center;
                    &.light {
                        color: $default-light-color;
                    }
                }
                .change {
                    display: block;
                    text-align: center;
                    font-size: $font-size-XS;
                    .icon_svg {
                        width: 6px;
                        height: 6px;
                    }
                }
            }
            .song-info {
                width: 80%;
                margin-left: 5px;
                .name {
                    font-weight: 300;
                    color: $default-color-M;
                }
                .desc {
                    font-size: $font-size-S;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
</style>
