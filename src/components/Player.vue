<template>
    <div class="player" v-show="getSequenceList.length > 0">
        <transition name="player">
            <div class="base-player" v-show="getFullScreen" ref="player">
                <div class="bg" :style="bgStyle"></div>
                <header>
                    <i class="back" @click="fullScreen(false)"></i>
                    <div class="title">{{ getCurrentSong.name }}</div>
                    <div class="name">{{ getCurrentSong.singer_name }}</div>
                </header>
                <div class="content">
                    <div class="content-wrapper cd-wrapper" v-show="!lyrics" @click="showLyrics">
                        <div class="bar on" ref="bar"></div>
                        <div class="plate-wrapper">
                            <div class="plate" ref="plate"></div>
                        </div>
                        <div class="slide-wrapper" ref="slide">
                            <slide v-if="getSequenceList.length"
                                :showDot="false"
                                :autoPlay="false"
                                :curIndex="getCurrentIndex"
                                :loop="getSequenceList.length > 1"
                                @pageIndex="onPageIndexChange"
                                @beforeSlideStart="onBeforeSlideStart"
                                @touchEnd="onSlideTouchEnd"
                                ref="slider"
                            >
                                <div v-for="song in getSequenceList" :key="song.id" class="cd">
                                    <div class="cdImg" :style="getImgURL(song.album.mid)" ref="CD"></div>
                                </div>
                            </slide>
                        </div>
                    </div>
                    <div class="content-wrapper lyrics-wrapper" v-show="lyrics" @click="showLyrics">
                        <scroller class="lyrics-lines" ref="lyricsScroller"
                            :dataList="lines"
                        >
                            <div class="lines">
                                <p 
                                    :class="{ 'lyrics-line': true, 'active': index === lineIndex }" 
                                    v-for="(word, index) in lines" :key="index"
                                    ref="line"
                                >
                                    {{ word }}
                                </p>
                            </div>
                        </scroller>
                    </div>
                </div>
                <div class="operate">
                    <div class="player">
                        <div class="start">{{ formatTime(time) }}</div>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percent="onPercentChange"></progress-bar>
                        </div>
                        <div class="end">{{ formatTime(getCurrentSong.interval) }}</div>
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
            <div class="mini-player" v-show="!getFullScreen">
                <div class="cd play" ref="minCD" @click="fullScreen(true)">
                    <img src="~assets/images/tmp.jpg" ref="miniCDimg">
                </div>
                <div class="describe">
                    <div class="title">{{ getCurrentSong.name }}</div>
                    <div class="name">{{ getCurrentSong.singer_name }}</div>
                </div>
                <div class="btns">
                    <i class="stop" @click="togglePlay" ref="minPlayBtn"></i>
                    <i class="show-sequence-list" @click="set_isShowList(true)"></i>
                </div>
            </div>
        </transition>

        <audio ref="audio" :src="getCurrentSong.url" @play="ready" @error="error"></audio>

    </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { getAlbumPic, formatTime } from '@/utils/utils'
import { addClass, removeClass } from '@/utils/dom'
import { MODE } from '@/utils/constants'
import ProgressBar from '@/components/ProgressBar.vue'
import Slide from '@/components/Slide.vue'
import Scroller from '@/components/Scroller.vue'
import { Getter, Mutation } from "vuex-class"
import PlayerMixin from "@/components/PlayerMixin"
import { mixins } from 'vue-class-component';

@Component({
	name: 'Player',
	components: {
		ProgressBar,
		Slide,
		Scroller,
	},
})
export default class Player extends mixins(PlayerMixin) {
	// 歌曲是否准备好
	songReady: boolean = false
	// 当前时间
	time: number =  0
	// 定时器
	timer: number = 0
	// 是否正在查看歌词
	lyrics: boolean =  false
	// 歌词列表
	lines: Array<any> =  []
	// 时间区间
	sections: Array<any> = []
	// 当前播放到哪一句
	lineIndex: number = 0

	private _formatTime(time: number) {
		return formatTime(time)
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
        &.player-enter-active, &.player-leave-active {
            transition: all 0.4s;
            header, .operate {
                transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
            }
        }
        &.player-enter, &.player-leave-to {
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
            transition: background .5s;
        }
        header {
            position: relative;
            height: 10%;
            font-size: $font-size-L;
            color: #ffffff;
            .back {
                position: absolute;
                top: 10px;
                left: 10px;
                z-index: 50;
                width: 32px;
                height: 32px;
                @include bg-image("../../common/images/back");
                background-size: contain;
                transform: rotate(270deg);
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
                        background-image: url('~assets/images/bar.png');
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
                            border: 10px solid rgba(163, 164, 167, .3);
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
                                        background-image: url('~assets/images/record.png');
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
                        content: ' ';
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
                .start, .end {
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
                        background-image: url('~assets/images/order.png');
                    }
                    &.single {
                        background-image: url('~assets/images/single.png');
                    }
                    &.random {
                        background-image: url('~assets/images/random.png');
                    }
                    &.prev {
                        background-image: url('~assets/images/prev.png');
                    }
                    &.stop {
                        background-image: url('~assets/images/stop.png');
                    }
                    &.play {
                        background-image: url('~assets/images/play.png');
                    }
                    &.next {
                        background-image: url('~assets/images/next.png');
                    }
                    &.collect {
                        background-image: url('~assets/images/collect.png');
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
        &.mini-enter-active, &.mini-leave-active {
            transition: all 0.4s;
        }
        &.mini-enter, &.mini-leave-to {
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
                    background-image: url('~assets/images/play.png');
                }
                &.stop {
                    margin-right: 25px;
                    background-image: url('~assets/images/stop.png');
                }
                &.show-sequence-list {
                    background-image: url('~assets/images/list.png');
                }
            }
        }
    }
}
</style>
