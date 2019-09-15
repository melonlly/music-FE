<template>
    <div
        class="progress-bar"
        ref="progress_bar"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
        @click="progressGoto"
    >
        <i class="cursor" ref="cursor"></i>
        <div class="progress" ref="progress"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { transform } from "@/utils/constants";

@Component({
    name: "ProgressBar",
    components: {}
})
export default class ProgressBar extends Vue {
    @Prop({
        default: 0
    })
    private readonly percent?: number;

    created() {
        this.$nRpsPty.touch = {}; // 当前触摸点的信息
        this.$nRpsPty.barWidth = 0; // 进度条长度
    }

    @Watch("percent")
    private onPercent(newPercent: number) {
        const barWidth = (this.$refs.progress_bar as HTMLElement).clientWidth // 当进度条隐藏时，clientWidth获取的宽度为0
        if (barWidth > 0 && this.$nRpsPty.barWidth !== barWidth) {
            this.$nRpsPty.barWidth = barWidth
        }
        if (newPercent > 0) {
            this._offsetProgress(newPercent * this.$nRpsPty.barWidth)
        }
    }

    private progressTouchStart(e: any) {
        this.$nRpsPty.touch.initiated = true;
        this.$nRpsPty.touch.startX = e.touches[0].pageX;
    }
    private progressTouchMove(e: any) {
        if (!this.$nRpsPty.touch.initiated) {
            return false;
        }
        const deltaX = e.touches[0].pageX - this.$nRpsPty.touch.startX; // 滑动距离（左负右正）
        this._offsetProgress(
            (this.percent || 0) * this.$nRpsPty.barWidth + deltaX
        );
    }
    private progressTouchEnd() {
        this.$nRpsPty.touch.initiated = false;
        // 拖动完成时，触发改动进度的回调事件
        this._triggerPercent();
    }
    private progressGoto(e: any) {
        this._offsetProgress(
            e.pageX -
                (this.$refs.progress_bar as HTMLElement).getBoundingClientRect()
                    .left
        );
        this._triggerPercent();
    }
    private _offsetProgress(progress: number) {
        if (progress >= 0 && progress <= this.$nRpsPty.barWidth) {
            ((this.$refs.cursor as HTMLElement).style as any)[
                transform
            ] = `translate(${progress - 8}px, -5.5px)`;
            (this.$refs.progress as HTMLElement).style.width = `${progress}px`;
        } else {
            return false;
        }
    }
    private _triggerPercent() {
        const w = (this.$refs.progress as HTMLElement).style.width || "0";
        this.$emit(
            "percent",
            parseInt(w.replace("px", ""), 10) / this.$nRpsPty.barWidth
        );
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.progress-bar {
    background: $default-color-S;
    width: 100%;
    height: 100%;
    .cursor {
        position: absolute;
        transform: translate(-8px, -5.5px);
        width: 16px;
        height: 16px;
        border-radius: 100%;
        background: $default-color-M;
        z-index: 10;
        &:after {
            content: " ";
            position: absolute;
            transform: translate(50%, 50%);
            width: 8px;
            height: 8px;
            border-radius: 100%;
            background: $default-light-color;
        }
    }
    .progress {
        position: absolute;
        width: 0;
        height: 5px;
        background: $default-light-color;
    }
}
</style>
