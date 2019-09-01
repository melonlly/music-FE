<template>
    <div class="singer-list">
        <scroller v-if="singerList.length" ref="scroller"
            @onscroll="onscroll"
            :listen-scroll="listenScroll"
            :probe-type="probeType"
            :data="singerList"
        >
            <ul>
                <li class="category" v-for="(group, index) in singerList" :key="index" ref="group">
                    <h2 class="title">{{ group.index }}</h2>
                    <ul class="group">
                        <li class="item" v-for="(singer, index) in group.data" :key="index"
                            @click="selectSinger(singer)"
                        >
                            <img class="avatar" v-lazy="getSingerPic(singer.singer_mid)">
                            <span class="name">{{ singer.singer_name }}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </scroller>
        <div class="fixed-title" v-show="fixedTitle" ref="fixedTitle">
            <h2 class="title">{{ fixedTitle }}</h2>
        </div>
        <div class="cursor-bar" v-if="singerList.length"
            @touchstart.stop.prevent="onCursorTouch" 
            @touchmove.stop.prevent="onCursorMove" 
            @touchend.stop
        >
            <ul>
                <li v-for="(group, index) in singerList" :key="index" 
                    :data-index="index"
                    :class="{active: cursor === index}"
                >
                    {{ group.index.substring(0, 1) }}
                </li>
            </ul>
        </div>

        <!-- loading -->
        <loading v-show="!singerList.length"></loading>

        <!-- 歌手详情页 -->
        <transition name="slide">
            <router-view v-if="getSinger.singer_mid"></router-view>
        </transition>

    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Scroller from "@/components/Scroller.vue";
import Loading from "@/components/Loading.vue";
import { getSingerPic } from "@/utils/utils"
import { getData } from "@/utils/dom"
import { mapMutations, mapGetters } from 'vuex'

// 常量
const GROUP_TITLE_HEIGHT = 30 // 分组标题的高度（来着css中的定义）

@Component({
    name: 'SingerList',
	components: {
        Scroller,
        Loading
    },
})
export default class SingerList extends Vue {
    scrollY: number = 0 // 垂直滚动的位置
    singerList: Array<any> = [] // 歌手列表
    cursor: number = 0 // 当前索引位置
    overlap: number = 0 // fixed-title 和 group-title 产生重叠时，记录重叠值
    
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.singer-list {
    position: relative;
    overflow: hidden;
    .category {
        .title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: $font-size-XS;
            background: #323232;
        }
        .group {
            .item {
                height: 80px;
                line-height: 80px;
                padding-left: 20px;
                .avatar {
                    width: 60px;
                    height: 60px;
                    vertical-align: middle;
                    padding: 0 10px;
                    border-radius: 50%;
                }
                .name {
                    font-size: $font-size-S;
                }
            }
        }
    }
    .cursor-bar {
        position: absolute;
        z-index: 30;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        font-size: $font-size-S;
        li {
            height: 16px;
            text-align: center;
            &.active {
                color: $default-light-color;
            }
        }
    }
    .fixed-title {
        position: absolute;
        top: 0;
        width: 100%;
        .title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: $font-size-XS;
            background: #323232;
        }
    }
    .slide-enter-active, .slide-leave-active {
        transition: all .3s;
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0);
    }
}
</style>