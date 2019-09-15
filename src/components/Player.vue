<template>
    <div class="player" v-show="sequenceList.length > 0">
        <transition name="player">
            <div class="base-player" v-show="fullScreen" ref="player">
                <div class="bg" :style="albumBgStyle"></div>
                <header>
                    <back @back="setFullScreen(false)"></back>
                    <div class="title">{{ currentSong.name }}</div>
                    <div class="name">{{ currentSong.singer_name }}</div>
                </header>
                <div class="content">
                    <div class="content-wrapper cd-wrapper" v-show="!lyrics" @click="showLyrics">
                        <div class="bar on" ref="bar"></div>
                        <div class="plate-wrapper">
                            <div class="plate" ref="plate"></div>
                        </div>
                        <div class="slide-wrapper" ref="slide">
                            <slide
                                v-if="sequenceList.length"
                                :showDot="false"
                                :autoPlay="false"
                                :curIndex="currentIndex"
                                :loop="sequenceList.length > 1"
                                @pageIndex="onPageIndexChange"
                                @beforeSlideStart="onBeforeSlideStart"
                                @touchEnd="onSlideTouchEnd"
                                ref="slider"
                            >
                                <div v-for="song in sequenceList" :key="song.id" class="cd">
                                    <div
                                        class="cdImg"
                                        :style="getSongBgImgURL(song.album.mid)"
                                        ref="CD"
                                    ></div>
                                </div>
                            </slide>
                        </div>
                    </div>
                    <div class="content-wrapper lyrics-wrapper" v-show="lyrics" @click="showLyrics">
                        <scroller class="lyrics-lines" ref="lyricsScroller" :dataList="lines">
                            <div class="lines">
                                <p
                                    :class="{ 'lyrics-line': true, 'active': index === lineIndex }"
                                    v-for="(word, index) in lines"
                                    :key="index"
                                    ref="line"
                                >{{ word }}</p>
                            </div>
                        </scroller>
                    </div>
                </div>
                <div class="operate">
                    <div class="player">
                        <div class="start">{{ _formatTime(time) }}</div>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percent="onPercentChange"></progress-bar>
                        </div>
                        <div class="end">{{ _formatTime(currentSong.interval) }}</div>
                    </div>
                    <div class="btns">
                        <i :class="getModeCls" @click="switchMode"></i>
                        <i class="prev" @click="rollback"></i>
                        <i class="toggle stop" @click="togglePlay" ref="playBtn"></i>
                        <i class="next" @click="forward"></i>
                        <i class="collect" @click="collect"></i>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen">
                <div class="cd play" ref="minCD" @click="setFullScreen(true)">
                    <img src="~assets/images/tmp.jpg" ref="miniCDimg" />
                </div>
                <div class="describe">
                    <div class="title">{{ currentSong.name }}</div>
                    <div class="name">{{ currentSong.singer_name }}</div>
                </div>
                <div class="btns">
                    <i class="stop" @click="togglePlay" ref="minPlayBtn"></i>
                    <i class="show-sequence-list" @click="setIsShowList(true)"></i>
                </div>
            </div>
        </transition>

        <audio ref="audio" @canplay="ready" @error="error"></audio>
    </div>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import { getAlbumPic, formatTime } from "@/utils/utils";
import { addClass, removeClass } from "@/utils/dom";
import { MODE } from "@/utils/constants";
import ProgressBar from "@/components/ProgressBar.vue";
import Slide from "@/components/Slide.vue";
import Scroller from "@/components/Scroller.vue";
import PlayerMixin from "@/components/PlayerMixin";
import Back from "@/components/Back.vue"
import { mixins } from "vue-class-component";

@Component({
    name: "Player",
    components: {
        ProgressBar,
        Slide,
        Scroller,
        Back
    }
})
export default class Player extends mixins(PlayerMixin) {
    // 歌曲是否准备好
    songReady: boolean = false;
    // 当前时间
    time: number = 0;
    // 定时器
    timer: number = 0;
    // 是否正在查看歌词
    lyrics: boolean = false;
    // 歌词列表
    lines: Array<any> = [];
    // 时间区间
    sections: Array<any> = [];
    // 当前播放到哪一句
    lineIndex: number = 0;

    created() {
        this.$nRpsPty.hasLyric = false // 歌词是否加载完毕
    }

    @Watch("currentSong")
    onCurrentSongChange(newSong: any, oldSong: any) {
        clearInterval(this.timer);
        this.timer = 0;
        (this.$refs.audio as any).pause();
        (this.$refs.audio as any).currentTime = 0;
        this.songReady = false;
        this.time = 0;

        const albumPic = getAlbumPic(this.currentSong.album.mid);
        // this.$refs.bgImg.setAttribute('src', album_pic)
        // this.$refs.cdImg.setAttribute('src', album_pic)
        (this.$refs.miniCDimg as HTMLElement).setAttribute("src", albumPic);
        this.$nextTick(() => {
            const playerWidth = (this.$refs.player as HTMLElement).clientWidth;
            (this.$refs.plate as HTMLElement).style.height = `${playerWidth * 0.8}px`;
            (this.$refs.slide as HTMLElement).style.height = `${playerWidth * 0.8}px`;

            // TODO 歌词和media加载完毕才能播放
            this.formatLyrics();
            this.getMediaUrl();
        });
    }
    // 当前时间 -> 当前行
    @Watch("time")
    onTimeChange(now: number) {
        let lineIndex = 0;
        const sections = this.sections;
        const lines = this.lines;
        const time = now;
        if (sections && sections.length > 0) {
            for (let i = 0; i < sections.length; i++) {
                if (time >= sections[i]) {
                    lineIndex = i;
                } else {
                    break;
                }
            }
        }
        // 处理空行情况（空行时，设置当前行为上一行）
        if (!lines[lineIndex]) {
            lineIndex -= 1;
        }
        this.lineIndex = lineIndex;
    }
    // 当前行下标
    @Watch("lineIndex")
    onLineIndexChange(newIndex: number) {
        (this.$refs.lyricsScroller as Scroller).scrollToElement(
            (this.$refs.line as HTMLElement[])[newIndex],
            300,
            false,
            true
        );
    }

    // 获取专辑背景图片
    private get albumBgStyle() {
        const mid = this.currentSong.album ? this.currentSong.album.mid : "";
        return `background-image:url(${
            mid ? getAlbumPic(mid) : "~assets/images/tmp.jpg"
        })`;
    }
    // 当前进度百分比
    private get percent() {
        return this.time / this.currentSong.interval;
    }
    // 获取模式对应样式
    private get getModeCls() {
        let clsName = "";
        switch (this.mode) {
            // 列表循环
            case MODE.ORDER: {
                clsName = "order";
                break;
            }
            // 单曲循环
            case MODE.SINGLE: {
                clsName = "single";
                break;
            }
            // 随机播放
            case MODE.RANDOM: {
                clsName = "random";
                break;
            }
            default: {
                clsName = "order";
                break;
            }
        }
        return clsName;
    }

    private _formatTime(time: number) {
        return formatTime(time);
    }
    // 设置是否全屏
    private _fullScreen(full: boolean) {
        this.lyrics = false;
        this.setFullScreen(full);
    }
    // 显示/隐藏 歌词
    private showLyrics() {
        this.lyrics = !this.lyrics;
    }
    // 音频加载完成
    private ready() {
        this.songReady = true;
        console.log(`this.$nRpsPty.hasLyric = ${ this.$nRpsPty.hasLyric }`)
        if (this.$nRpsPty.hasLyric) {
            this.play()
        }
    }
    // 音频加载异常
    private error() {
        this.songReady = true;
        console.log(`this.$nRpsPty.hasLyric = ${ this.$nRpsPty.hasLyric }`)
        if (this.$nRpsPty.hasLyric) {
            this.play()
        }
    }
    // 切换模式
    private switchMode() {
        switch (this.mode) {
            // 顺序播放
            case MODE.ORDER: {
                this.setMode(MODE.SINGLE);
                break;
            }
            // 单曲循环
            case MODE.SINGLE: {
                this.setMode(MODE.RANDOM);
                break;
            }
            // 随机播放
            case MODE.RANDOM: {
                this.setMode(MODE.ORDER);
                break;
            }
            default: {
                this.setMode(MODE.SINGLE);
                break;
            }
        }
    }
    // 上一首
    private rollback() {
        this.onBeforeSlideStart();
        this.prev();
    }
    // 播放/暂停
    private togglePlay() {
        if (this.playing) {
            this.paused();
        } else {
            this.play();
        }
    }
    // 重播
    private replay() {
        this.paused();
        this.time = 0;
        (this.$refs.audio as any).currentTime = 0;
        this.play();
    }
    // 下一首
    private forward() {
        this.onBeforeSlideStart();
        this.next();
    }
    // 收藏
    private collect() {
        return;
    }
    // 播放
    private play() {
        const playBtn = this.$refs.playBtn as HTMLElement;
        const minPlayBtn = this.$refs.minPlayBtn as HTMLElement;
        const cd = (this.$refs.CD as HTMLElement[])[this.currentIndex];
        const minCD = this.$refs.minCD as HTMLElement;
        const bar = this.$refs.bar as HTMLElement;
        this.setPlaying(true);

        // 设置按钮状态
        removeClass(playBtn, "play");
        addClass(playBtn, "stop");
        removeClass(cd, "paused");
        addClass(cd, "play");
        removeClass(minPlayBtn, "play");
        addClass(minPlayBtn, "stop");
        removeClass(minCD, "paused");
        addClass(bar, "on");

        this.timer = setInterval(this._play, 1000);
        (this.$refs.audio as any).play();
    }
    // 暂停
    private paused() {
        const playBtn = this.$refs.playBtn as HTMLElement;
        const minPlayBtn = this.$refs.minPlayBtn as HTMLElement;
        const cd = (this.$refs.CD as HTMLElement[])[this.currentIndex];
        const minCD = this.$refs.minCD as HTMLElement;
        const bar = this.$refs.bar as HTMLElement;
        this.setPlaying(false);

        // 设置按钮状态
        removeClass(playBtn, "stop");
        addClass(playBtn, "play");
        addClass(cd, "paused");
        removeClass(minPlayBtn, "stop");
        addClass(minPlayBtn, "play");
        addClass(minCD, "paused");
        removeClass(bar, "on");

        clearInterval(this.timer);

        (this.$refs.audio as any).pause();
    }
    // 进度条改变事件
    private onPercentChange(newPercent: number) {
        this.time = Math.floor(this.currentSong.interval * newPercent);
        // 设置音频当前时间
        (this.$refs.audio as any).currentTime = this.time;
    }
    // 横向滑动切歌 - 开始时触发事件
    private onBeforeSlideStart() {
        if (this.sequenceList.length <= 1) return false;
        const index = this.currentIndex;
        const list = this.sequenceList;
        const prev = (this.$refs.CD as HTMLElement[])[
            index === 0 ? list.length - 1 : index - 1
        ];
        const next = (this.$refs.CD as HTMLElement[])[
            index === list.length - 1 ? 0 : index + 1
        ];
        removeClass(this.$refs.bar as HTMLElement, "on");
        removeClass(prev, "play");
        removeClass(next, "play");
    }
    // 横向滑动切歌 - 结束时触发事件
    private onSlideTouchEnd() {
        addClass(this.$refs.bar as HTMLElement, "on");
    }
    // 歌曲切换事件
    private onPageIndexChange(index: number) {
        this.setCurrentIndex(index);
        (this.$refs.slider as Slide).goToPage(index, 0, 400);
    }
    // 获取media地址
    private getMediaUrl() {
        this.$axios.post(`/song/media/`, {
            mid: this.currentSong.mid,
            mediamid: this.currentSong.mediamid
        }).then(res => {
            if (res.status === this.$OK) {
                (this.$refs.audio as any).src = res.data.media
            }
        })
    }
    // 格式化歌词
    private formatLyrics() {
        let rows: string[] = []; // 行
        const lines: string[] = []; // 歌词列表
        const sections: number[] = []; // 歌词区间
        let lyric = ""; // 歌词
        const song = this.currentSong
        lyric = song.lyrics

        const format = (lyrics: string) => {
            if (lyrics) {
                const div = document.createElement("div");
                div.innerHTML = lyrics;
                rows = div.innerHTML.split("\n");
                rows.forEach((row, index) => {
                    const parts = row.split("]");
                    const time = parts[0].replace("[", "");
                    const line = parts[1];
                    // 00:00.0
                    if (new RegExp(/^(\d{2}):(\d{2}).(\d{2})$/).test(time)) {
                        const minutes = parseInt(time.split(":")[0], 10);
                        const seconds = parseFloat(time.split(":")[1]);
                        sections.push(minutes * 60 + seconds);
                        lines.push(line);
                    }
                });
            } else {
                lines.push("暂无歌词");
            }
            this.lines = lines;
            this.sections = sections;

            this.$nRpsPty.hasLyric = true // 歌词加载完毕
            console.log(`this.songReady = ${ this.songReady }`)
            if (this.songReady) {
                this.play()
            }
        }

        // 判断歌词是否存在 -> 不存在则通过接口获取
        if (!lyric) {
            this.$axios.get(`/song/lyrics/${song.id}`).then(res => {
                if (res.status === this.$OK) {
                    format(res.data.lyric)
                }
            });
        } else {
            format(lyric)
        }
        
    }
    // 获取图片地址
    private getSongBgImgURL(mid: string) {
        return `background-image:url(${
            mid ? getAlbumPic(mid) : "~assets/images/tmp.jpg"
        })`;
    }
    // 播放事件（定时器事件）
    private _play() {
        if (this.time < this.currentSong.interval) {
            this.time++;
        } else {
            this.time = 0;
            this._loop(); // 播放轮询
        }
    }
    // 播放轮询
    private _loop() {
        switch (this.mode) {
            // 顺序播放
            case MODE.ORDER: {
                this.next();
                break;
            }
            // 单曲循环
            case MODE.SINGLE: {
                this.replay();
                break;
            }
            // 随机播放
            case MODE.RANDOM: {
                this.next();
                break;
            }
            default: {
                this.next();
                break;
            }
        }
    }
    // 获取CD与miniCD之间的相对坐标和缩放比例
    private _getPosAndScale() {
        const winInnerWidth = window.innerWidth;
        const winInnerHeight = window.innerHeight;
        const targetWidth = 48; // miniCD的宽度
        const left = winInnerWidth * 0.05;
        const bottom = 0;
        const top = winInnerHeight * 0.1;
        const width = winInnerWidth * 0.8; // CD的宽度
        const scale = targetWidth / width;
        const x = -(winInnerWidth / 2 - left);
        const y = winInnerHeight - top - width / 2 - bottom;
        return { x, y, scale };
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.player {
    letter-spacing: 1px;
    .base-player {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 150;
        background: $background-color;
        &.player-enter-active,
        &.player-leave-active {
            transition: all 0.4s;
            header,
            .operate {
                transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
            }
        }
        &.player-enter,
        &.player-leave-to {
            opacity: 0;
            header {
                transform: translate3d(0, -100px, 0);
            }
            .operate {
                transform: translate3d(0, 100px, 0);
            }
        }
        .bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(10px);
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            transition: background 0.5s;
        }
        header {
            position: relative;
            height: 10%;
            font-size: $font-size-L;
            color: #ffffff;
            .back {
                width: 32px;
                height: 32px;
                @include bg-image("~assets/images/back");
                transform: rotate(0);
            }
            .title {
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
            }
            .name {
                position: absolute;
                bottom: 10%;
                left: 50%;
                transform: translateX(-50%);
                font-size: $font-size-S;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .content {
            height: 65%;
            .content-wrapper {
                width: 100%;
                height: 100%;
                &.cd-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    .bar {
                        position: absolute;
                        width: 20%;
                        height: 100%;
                        margin-left: 48%;
                        background-image: url("~assets/images/bar.png");
                        background-size: contain;
                        background-repeat: no-repeat;
                        z-index: 10;
                        transform-origin: 10px 10px;
                        transform: rotate(-30deg);
                        transition: all 1s;
                        &.on {
                            transform: rotate(0);
                        }
                    }
                    .plate-wrapper {
                        position: absolute;
                        display: flex;
                        justify-content: center;
                        width: 100%;
                        .plate {
                            width: 80%;
                            border-radius: 100%;
                            border: 10px solid rgba(163, 164, 167, 0.3);
                        }
                    }
                    .slide-wrapper {
                        width: 100%;
                        .slide {
                            width: 100%;
                            height: 100%;
                            .cd {
                                height: 100%;
                                width: 100%;
                                .cdImg {
                                    position: relative;
                                    width: 80%;
                                    height: 100%;
                                    margin-left: 10%;
                                    background-size: cover;
                                    border-radius: 100%;
                                    &.play {
                                        animation: rotate 20s linear infinite;
                                    }
                                    &.paused {
                                        animation-play-state: paused;
                                    }
                                    &:after {
                                        content: " ";
                                        position: absolute;
                                        left: 0;
                                        right: 0;
                                        top: 0;
                                        bottom: 0;
                                        background-image: url("~assets/images/record.png");
                                        background-size: cover;
                                    }
                                }
                            }
                        }
                    }
                }
                &.lyrics-wrapper {
                    position: relative;
                    .lyrics-lines {
                        padding: 0 30px;
                        text-align: center;
                        font-size: $font-size-S;
                        line-height: 30px;
                        overflow: hidden;
                        .lines {
                            margin: 50% 0;
                            .lyrics-line {
                                &.active {
                                    color: $default-color-M;
                                }
                            }
                        }
                    }
                    &:before {
                        content: " ";
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 10%;
                        background: inherit;
                        filter: blur(5px);
                    }
                }
            }
        }
        .operate {
            position: absolute;
            width: 100%;
            height: 25%;
            bottom: 0;
            color: $default-color-M;
            .player {
                @include centered;
                margin: 8% 0;
                font-size: $font-size-M;
                .start,
                .end {
                    display: inline-block;
                }
                .progress-bar-wrapper {
                    position: relative;
                    margin: 0 12px;
                    width: 60%;
                    height: 5px;
                }
            }
            .btns {
                @include centered;
                i {
                    margin: 0 4%;
                    width: 36px;
                    height: 36px;
                    background-size: contain;
                    z-index: 10;
                    &.toggle {
                        transform: scale(1.3);
                    }
                    &.order {
                        background-image: url("~assets/images/order.png");
                    }
                    &.single {
                        background-image: url("~assets/images/single.png");
                    }
                    &.random {
                        background-image: url("~assets/images/random.png");
                    }
                    &.prev {
                        background-image: url("~assets/images/prev.png");
                    }
                    &.stop {
                        background-image: url("~assets/images/stop.png");
                    }
                    &.play {
                        background-image: url("~assets/images/play.png");
                    }
                    &.next {
                        background-image: url("~assets/images/next.png");
                    }
                    &.collect {
                        background-image: url("~assets/images/collect.png");
                    }
                }
            }
        }
    }
    .mini-player {
        position: fixed;
        display: flex;
        align-items: center;
        bottom: 0;
        left: 0;
        height: 10%;
        width: 100%;
        z-index: 200;
        background: #000000;
        &.mini-enter-active,
        &.mini-leave-active {
            transition: all 0.4s;
        }
        &.mini-enter,
        &.mini-leave-to {
            opacity: 0;
        }
        .cd {
            width: 48px;
            height: 48px;
            margin-left: 5%;
            margin-right: 3%;
            border-radius: 100%;
            overflow: hidden;
            &.play {
                animation: rotate 20s linear infinite;
            }
            &.paused {
                animation-play-state: paused;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
        .describe {
            .title {
                font-size: 16px;
                color: #ffffff;
            }
            .name {
                font-size: $font-size-XS;
            }
        }
        .btns {
            position: absolute;
            right: 5%;
            font-size: 0;
            i {
                display: inline-block;
                width: 36px;
                height: 36px;
                background-size: contain;
                &.play {
                    margin-right: 25px;
                    background-image: url("~assets/images/play.png");
                }
                &.stop {
                    margin-right: 25px;
                    background-image: url("~assets/images/stop.png");
                }
                &.show-sequence-list {
                    background-image: url("~assets/images/list.png");
                }
            }
        }
    }
}
</style>
