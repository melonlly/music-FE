<template>
    <div class="loading">
        <img width="24" height="24" src="~assets/images/loading.gif">
        <p class="desc">{{ title }}</p>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
    name: "Loading",
    components: {},
})
export default class Loading extends Vue {
    @Prop({
        default: "正在载入..."
    })
    private readonly title?: string
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/mixin.scss';
.loading {
    position: absolute;
    z-index: 300;
    left: 50%;
    top: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    text-align: center;
    .desc{
        line-height: 20px;
        font-size: $font-size-M;
        color: $default-light-color;
    }
}
</style>



