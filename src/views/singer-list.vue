<template>
    <div class="singer-list">
        <scroller
            v-if="singerList.length"
            ref="scroller"
            @onscroll="onscroll"
            :listen-scroll="$nRpsPty.listenScroll"
            :probe-type="$nRpsPty.probeType"
            :dataList="singerList"
        >
            <ul>
                <li class="category" v-for="(group, index) in singerList" :key="index" ref="group">
                    <h2 class="title">{{ group.index }}</h2>
                    <ul class="group">
                        <li
                            class="item"
                            v-for="(singer, index) in group.data"
                            :key="index"
                            @click="selectSinger(singer)"
                        >
                            <img class="avatar" v-lazy="_getSingerPic(singer.singer_mid)" />
                            <span class="name">{{ singer.singer_name }}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </scroller>
        <div class="fixed-title" v-show="fixedTitle" ref="fixedTitle">
            <h2 class="title">{{ fixedTitle }}</h2>
        </div>
        <div
            class="cursor-bar"
            v-if="singerList.length"
            @touchstart.stop.prevent="onCursorTouch"
            @touchmove.stop.prevent="onCursorMove"
            @touchend.stop
        >
            <ul>
                <li
                    v-for="(group, index) in singerList"
                    :key="index"
                    :data-index="index"
                    :class="{active: cursor === index}"
                >{{ group.index.substring(0, 1) }}</li>
            </ul>
        </div>

        <!-- loading -->
        <loading v-show="!singerList.length"></loading>

        <!-- 歌手详情页 -->
        <transition name="slide">
            <router-view v-if="singer.singer_mid"></router-view>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Scroller from "@/components/Scroller.vue";
import Loading from "@/components/Loading.vue";
import { getSingerPic, goto } from "@/utils/utils";
import { getData } from "@/utils/dom";
import { Getter, Mutation } from "vuex-class"

// 常量
const GROUP_TITLE_HEIGHT = 30; // 分组标题的高度（来着css中的定义）

@Component({
    name: "SingerList",
    components: {
        Scroller,
        Loading
    }
})
export default class SingerList extends Vue {
    scrollY: number = 0; // 垂直滚动的位置
    singerList: Array<any> = []; // 歌手列表
    cursor: number = 0; // 当前索引位置
    overlap: number = 0; // fixed-title 和 group-title 产生重叠时，记录重叠值

    @Getter("getSinger")
    singer!: any

    @Mutation("SET_SINGER")
    setSinger!: (singer: any) => void

    created() {
        this.$nRpsPty.probeType = 3; // 滚动类型
        this.$nRpsPty.listenScroll = true; // 是否监听滚动
        this.$nRpsPty.touch = {}; // 触摸点的属性
        this.$nRpsPty.groupsHeight = []; // 记录group的高度区间

        const mid = this.$route.params.mid;
        if (mid) {
            this._getSingerList().then(() => {
                let curSinger;
                for (let i = 0; i < this.singerList.length; i++) {
                    let flag = false;
                    const singer = this.singerList[i].data;
                    for (let j = 0; j < singer.length; j++) {
                        if (singer[j].singer_mid === mid) {
                            curSinger = singer[j];
                            flag = true;
                            break;
                        }
                    }
                    if (flag) break;
                }
                this.selectSinger(curSinger);
            });
        } else {
            this._getSingerList();
        }
    }

    @Watch("singerList")
    onSingerListChange() {
        setTimeout(() => {
            this._calculateHeight();
        }, 20);
    }
    // 注意：向下为负，向上为正
    @Watch("scrollY")
    onScrollYChange(newY: number) {
        // 判断当前垂直滚动位置在哪个区间内
        for (let i = 0; i < this.$nRpsPty.groupsHeight.length; i++) {
            if (newY > -this.$nRpsPty.groupsHeight[i]) {
                this.cursor = i - 1
                break
            }
        }
        /** 
         *  判断scroller视口上边沿距离下一个group的上边沿的距离是否小于一个GROUP_TITLE_HEIGHT
         *  若小于，则实时获取其差值，向上移动fixed-title
         */
        // 下一个group的上边沿位置
        const nextGroupPosY = this.$nRpsPty.groupsHeight[this.cursor + 1]
        // 当前垂直位置
        const nowPosY = newY * -1
        // 当fixed-title和下一个group-title产生重叠时，设置overlap
        const diff = nextGroupPosY - nowPosY
        if (diff <= GROUP_TITLE_HEIGHT) {
            this.overlap = GROUP_TITLE_HEIGHT - diff
        } else {
            this.overlap = 0
        }
    }
    @Watch("overlap")
    onOverlapChange(newVal: number) {
        (this.$refs.fixedTitle as HTMLElement).style.transform = `translate3d(0, -${newVal}px, 0)`
    }

    // 滚动到指定位置时，fixed title
    private get fixedTitle(): string {
        // 向上滚动时，不显示fixed-title
        if (this.scrollY >= 0) return "";
        return this.singerList[this.cursor]
            ? this.singerList[this.cursor].index
            : "";
    }

    private selectSinger(singer: any) {
        // 跳转歌手详情页（判断路由是否相同，解决 路由重复 NavigationDuplicated 问题）
        if (this.$route.path !== `/singer/${singer.singer_mid}`) {
            goto(this.$router, {
                path: `/singer/${singer.singer_mid}`
            })
        }
        // 保存当前歌手信息
        this.setSinger(singer);
    }
    private _getSingerPic(mid: string) {
        return getSingerPic(mid);
    }
    // 获取歌手列表
    private _getSingerList() {
        return this.$axios.get("/singer/list/", {}).then(res => {
            if (res.status === this.$OK) {
                this.singerList = res.data;
            }
            return new Promise(resolve => {
                resolve();
            });
        });
    }
    // 快速索引条点击事件
    private onCursorTouch(e: any) {
        const index = getData(e.target, "index") || "0"
        this.cursor = parseInt(index, 10)
        this.$nRpsPty.touch.y1 = e.touches[0].pageY;
        (this.$refs.scroller as Scroller).scrollToElement((this.$refs.group as HTMLElement[])[this.cursor], 0);
    }
    private onCursorMove(e: any) {
        // console.log(e.touches);
    }
    // 监听滚动条
    private onscroll(pos: any) {
        this.scrollY = pos.y;
    }
    // 计算当前分组高度区间
    private _calculateHeight() {
        this.$nRpsPty.groupsHeight = [];
        const groups = this.$refs.group as Element[]
        let height = 0; // 初始位置
        this.$nRpsPty.groupsHeight.push(height);
        for (let i = 0; i < groups.length; i++) {
            height += groups[i].clientHeight;
            this.$nRpsPty.groupsHeight.push(height);
        }
    }
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
    .slide-enter-active,
    .slide-leave-active {
        transition: all 0.3s;
    }
    .slide-enter,
    .slide-leave-to {
        transform: translate3d(100%, 0, 0);
    }
}
</style>