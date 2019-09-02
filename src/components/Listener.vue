<template>
    <div class="listener">
        {{ $nRpsPty.format(num) }}
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { formatNum } from '@/utils/utils'

@Component({
    name: "Listener",
    components: {},
    created() {
        this.$nRpsPty.format = formatNum
    }
})
export default class Listener extends Vue {
    @Prop({
        default: 0
    })
    private readonly num?: number
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/mixin.scss';
.listener {
    font-size: $font-size-XS;
    color: $default-color-M;
    &:before {
        content: ' ';
        display: block;
        float: left;
        width: $font-size-XS;
        height: $font-size-XS;
        background-position: 0 -50px;
        margin-right: 3px;
        margin-top: 4px;
        background-image: url('~assets/images/play_sprite.png');
        background-repeat: no-repeat;
        background-size: 24px 60px;
    }
}
</style>
