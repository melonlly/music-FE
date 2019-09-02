<template>
    <div class="singer-detail" ref="detail">
        <div class="back" @click="_back"></div>
        <div class="title">{{ singer.singer_name }}</div>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper" v-show="false">
                <div ref="playBtn" v-show="songs.length > 0" class="play">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
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
                <div class="name">{{ song.name }}</div>
                <div class="desc">{{ song.album.name }}</div>
            </div>
        </scroller>

        <!-- loading -->
        <loading v-show="!songs.length"></loading>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Scroller from "@/components/Scroller.vue";
import Loading from "@/components/Loading.vue";
import { getSingerPic } from "@/utils/utils";
import { transform, filter } from "@/utils/constants";
import { Getter, Action } from "vuex-class";

const minHeaderHeight = 40; // 最小标题高度

@Component({
    name: "SingerDetail",
    components: {
        Loading,
        Scroller
    }
})
export default class SingerDetail extends Vue {
    songs: Array<any> = []; // 歌手相关歌曲
    scrollY: number = 0; // 垂直滚动距离

    @Getter("getSinger")
    singer!: any;

    @Action("selectSong")
    selectSong!: (payload: any) => void;

    private get bgStyle() {
        const mid = this.singer.singer_mid;
        return `background-image:url(${mid ? getSingerPic(mid) : ""})`;
    }

    created() {
        this.$nRpsPty.probeType = 3; // 滚动类型
        this.$nRpsPty.listenScroll = true; // 是否监听滚动

        this._getSingerDetail();
    }
    mounted() {
        this.$nRpsPty._top = (this.$refs.bgImage as HTMLElement).clientHeight;
        ((this.$refs.content as Vue)
            .$el as HTMLElement).style.top = `${this.$nRpsPty._top}px`;
        // 最大滚动距离
        this.$nRpsPty.maxTranslateY = this.$nRpsPty._top - minHeaderHeight;
    }

    @Watch("scrollY")
    onScrollYChange(newY: number) {
        const translateY = newY * -1; // 滚动距离
        let zIndex = 0;
        let scale = 1;
        let blur = 0;

        const $bgImage = this.$refs.bgImage as HTMLElement;
        const $layer = this.$refs.layer as HTMLElement;

        const percent = Math.abs(newY / this.$nRpsPty._top);
        if (newY > 0) {
            // scrollTop为0时，向下拉动
            scale = 1 + percent;
            zIndex = 10;
        } else {
            // 向上拉动
            blur = Math.min(20, percent * 20);
        }

        if (translateY <= this.$nRpsPty.maxTranslateY) {
            ($layer.style as any)[
                transform
            ] = `translate3d(0, -${translateY}px, 0)`;
            $bgImage.style.paddingTop = `70%`;
        } else {
            zIndex = 10;
            blur = 0;
            $bgImage.style.paddingTop = `${minHeaderHeight}px`;
            // this.$refs.playBtn.style.display = 'none'
        }
        ($bgImage.style as any)[filter] = `blur(${blur}px)`;
        ($bgImage.style as any)[transform] = `scale(${scale})`;
        $bgImage.style.zIndex = String(zIndex);
    }

    @Watch("singer")
    onSingerChange() {
        this.songs = [];
        this.scrollY = 0;
        this._getSingerDetail();
    }

    private _getSingerDetail() {
        if (!this.singer.singer_mid) {
            this._back();
        } else {
            // 获取歌手详细信息
            this.$axios.get(`/singer/${this.singer.singer_mid}`).then(res => {
                if (res.status === this.$OK) {
                    this.songs = res.data.songs;
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
    // 选择歌曲
    select(song: any, index: number) {
        this.selectSong({
            list: this.songs,
            index
        });
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.singer-detail {
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: $background-color;
    .back {
        position: absolute;
        z-index: 50;
        top: 10px;
        left: 10px;
        width: 32px;
        height: 32px;
        @include bg-image("~assets/images/back");
        background-size: cover;
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
        color: $default-color-M;
    }
    .bg-image {
        position: relative;
        width: 100%;
        padding-top: 70%;
        transform-origin: top;
        background-size: cover;
        .play-wrapper {
            position: absolute;
            z-index: 50;
            bottom: 20px;
            width: 100%;
            .play {
                box-sizing: border-box;
                width: 135px;
                padding: 7px 0;
                margin: 0 auto;
                text-align: center;
                border: 1px solid $default-light-color;
                color: $default-light-color;
                border-radius: 100px;
                font-size: 0;
                .icon-play {
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 6px;
                    font-size: $font-size-M;
                }
                .text {
                    display: inline-block;
                    vertical-align: middle;
                    font-size: $font-size-S;
                }
            }
        }
        .filter {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(7, 17, 27, 0.4);
            filter: blur(1px);
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
        padding: 0 25px 30px 25px;
        background: $background-color;
        .song {
            margin-top: 30px;
            .name {
                color: $default-color-M;
                margin-bottom: 10px;
            }
            .desc {
                font-size: $font-size-S;
            }
        }
    }
}
</style>
