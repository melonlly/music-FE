<template>
    <div class="slide" ref="slide">
        <div class="slide-group" ref="slideGroup">
            <slot></slot>
        </div>
        <div v-if="showDot" class="dots">
            <span
                class="dot"
                :class="{active: currentPageIndex === index }"
                v-for="(item, index) in dots"
                :key="index"
            ></span>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import BScroll from "better-scroll";
import { addClass } from "@/utils/dom";

@Component({
    components: {}
})
export default class Slide extends Vue {
    name: string = "Slide";
    @Prop({
        default: true
    })
    private readonly loop?: boolean // 是否循环
    @Prop({
        default: true
    })
    private readonly autoPlay?: boolean // 是否自动播放
    @Prop({
        default: 4000
    })
    private readonly interval?: number // 播放间隔（单位：ms）
    @Prop({
        default: true
    })
    private readonly showDot?: boolean // 是否显示dots
    @Prop({
        default: true
    })
    private readonly click?: boolean // 是否可以点击
    @Prop({
        default: 0.3
    })
    private readonly threshold?: number // 可以滚动到下一个的阈值（snap参数）
    @Prop({
        default: 400
    })
    private readonly speed?: number // 切换速度（单位：ms）
    @Prop({
        default: 0
    })
    private readonly curIndex?: number // 当前下标
    
    dots: Array<any> = []; // dot个数
    currentPageIndex?: number = this.curIndex;

    resizeTimer?: number;
    slide!: BScroll;
    timer?: number;
    children!: HTMLCollection;
    // dom加载完成之后
    mounted() {
        this.update();
        window.addEventListener("resize", () => {
            if (!this.slide || !this.slide.enabled) {
                return;
            }
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                if (this.slide.isInTransition) {
                    this.onScrollEnd();
                } else {
                    if (this.autoPlay) {
                        this.play();
                    }
                }
                this.refresh();
            }, 60);
        });
    }
    // 被激活时
    activated() {
        if (!this.slide) {
            return;
        }
        this.slide.enable();
        const pageIndex = this.slide.getCurrentPage().pageX;
        this.slide.goToPage(pageIndex, 0, 0);
        this.currentPageIndex = pageIndex;
        if (this.autoPlay) {
            this.play();
        }
    }
    // 失活时
    deactivated() {
        this.slide.disable();
        clearTimeout(this.timer);
    }
    // 销毁前
    beforeDestroy() {
        this.slide.disable();
        clearTimeout(this.timer);
    }
    goToPage(x: number, y: number, time?: number, easing?: object) {
        this.slide && this.slide.goToPage(x, y, time, easing);
    }
    update() {
        if (this.slide) {
            this.slide.destroy();
        }
        this.$nextTick(() => {
            this.init();
        });
    }
    refresh() {
        this.setSlideWidth(true);
        this.slide.refresh();
    }
    prev() {
        this.slide.prev();
    }
    next() {
        this.slide.next();
    }
    init() {
        clearTimeout(this.timer);
        this.currentPageIndex = this.curIndex;
        this.setSlideWidth();
        if (this.showDot) {
            this.initDots();
        }
        this.initSlide();
        if (this.autoPlay) {
            this.play();
        }

        // 初始化到指定目标
        this.slide.goToPage(this.currentPageIndex || 0, 0, 0);
    }

    /* 内部私有函数 */
    // 初始化Slide的宽度
    private setSlideWidth(isResize?: boolean) {
        this.children = (this.$refs.slideGroup as Element).children;
        let width = 0;
        const slideWidth = (this.$refs.slide as Element).clientWidth;
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i] as HTMLElement;
            addClass(child, "slide-item");
            child.style.width = slideWidth + "px";
            width += slideWidth;
        }
        if (this.loop && !isResize) {
            width += 2 * slideWidth;
        }
        (this.$refs.slideGroup as HTMLElement).style.width = width + "px";
    }
    // Slide初始化
    private initSlide() {
        this.slide = new BScroll(this.$refs.slide as Element, {
            scrollX: true,
            scrollY: false,
            momentum: false,
            snap: {
                loop: this.loop,
                threshold: this.threshold,
                speed: this.speed
            },
            bounce: false,
            stopPropagation: true,
            click: this.click
        });
        this.slide.on("scrollEnd", this.onScrollEnd);
        this.slide.on("touchEnd", () => {
            if (this.autoPlay) {
                this.play();
            }
            this.$emit("touchEnd");
        });
        this.slide.on("beforeScrollStart", () => {
            if (this.autoPlay) {
                clearTimeout(this.timer);
            }
            this.$emit("beforeSlideStart");
        });
    }
    // 滚动结束事件
    private onScrollEnd() {
        const pageIndex = this.slide.getCurrentPage().pageX;
        this.currentPageIndex = pageIndex;
        if (this.autoPlay) {
            this.play();
        }
        this.$emit("pageIndex", this.currentPageIndex);
    }
    // 初始化dots
    private initDots() {
        this.dots = new Array(this.children.length);
    }
    // 开始
    private play() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.slide.next();
        }, this.interval);
    }

    /* 监听事件 */
    @Watch("loop")
    onLoop() {
        this.update();
    }
    @Watch("autoPlay")
    onAutoPlay() {
        this.update();
    }
    @Watch("speed")
    onSpeed() {
        this.update();
    }
    @Watch("threshold")
    onThreshold() {
        this.update();
    }
    @Watch("curIndex")
    onCurIndex() {
        this.$emit("pageIndex", this.curIndex);
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.slide {
    min-height: 1px;
    .slide-group {
        position: relative;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
        .slide-item {
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;
            a {
                display: block;
                width: 100%;
                overflow: hidden;
                text-decoration: none;
            }
            img {
                display: block;
                width: 100%;
            }
        }
    }
    .dots {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 12px;
        transform: translateZ(1px);
        text-align: center;
        font-size: 0;
        .dot {
            display: inline-block;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $default-color-S;
            &.active {
                width: 20px;
                border-radius: 5px;
                background: $default-color-M;
            }
        }
    }
}
</style>
