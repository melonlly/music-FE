<template>
    <div class="scroller" ref="scroller">
        <div class="scroller-content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import BScroll from 'better-scroll';

@Component({
    components: {}
})
export default class Scroller extends Vue {
	name: string = "Scroller"
	active: number = 0 // 默认第一个
	children: Array<any> = [] // 子元素集合
	scroller?: BScroll // 滚动条对象
	@Prop({
        required: true,
        default: () => []
	})
	private readonly dataList?: Array<any> // 数据组
    @Prop({
        default: 1
    })
    private readonly probeType?: number // 类型
    @Prop({
        default: false
    })
    private readonly listenScroll?: boolean // 是否监听滚动
    @Prop({
        default: false
    })
    private readonly click?: boolean // 是否能点击
    @Prop({
        default: 20
    })
    private readonly refreshDelay?: number // 刷新延时（单位：ms）
    @Prop({
        default: false
    })
    private readonly pullUpLoad?: boolean // 是否上拉刷新
    created() {
        this.$nextTick(() => {
            this.initScroll()
        })
    }
    @Watch('dataList')
    onDataListChange() {
        setTimeout(() => {
            this.refresh()
        }, this.refreshDelay)
    }

    // 初始化滚动条
    private initScroll() {
        this.scroller = new BScroll(this.$refs.scroller as Element, {
            probeType: this.probeType,
            scrollY: true, // 延 Y 轴滚动
            click: this.click,
            pullUpLoad: this.pullUpLoad && {
                threshold: 0,
            }
        })
        // 是否监听滚动
        if (this.listenScroll) {
            this.scroller.on('scroll', pos => {
                this.$emit('onscroll', pos)
            })
        }
        // 相关事件
        this.scroller.on('pullingUp', () => {
            this.$emit('onpullingUp')
        })
    }

    enable() {
        this.scroller && this.scroller.enable()
    }
    disable() {
        this.scroller && this.scroller.disable()
    }
    refresh() {
        this.scroller && this.scroller.refresh()
    }
    finishPullUp() {
        this.scroller && this.scroller.finishPullUp()
    }
    scrollTo(x: number, y: number, time?: number, easing?: object) {
        this.scroller && this.scroller.scrollTo(x, y, time, easing)
    }
    scrollToElement(el: string | HTMLElement, time?: number, offsetX?: number | boolean, offsetY?: number | boolean, easing?: object) {
        this.scroller && this.scroller.scrollToElement(el, time, offsetX, offsetY, easing)
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.scroller {
    height: 100%;
    .scroller-content {
        overflow: hidden;
        .scroller-item {
            position: relative;
            float: left;
            overflow: hidden;
            a {
                display: block;
                overflow: hidden;
                text-decoration: none;
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .dots {
        position: absolute;
        @include centered;
        bottom: 0;
        left: 0;
        height: 30px;
        width: 100%;
        i {
            width: 10px;
            height: 10px;
            margin: 0 5px;
            border-radius: 100%;
            background: rgba(133, 133, 133, 0.6);
            transition: width 0.4s;
            &.active {
                width: 20px;
                border-radius: 5px;
                background: $default-color-M;
            }
        }
    }
}
</style>
