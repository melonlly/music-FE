<template>
    <div class="footer">
        <footer>
            <div class="icon"></div>
        </footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
	name: 'Footer',
	components: {},
})
export default class Footer extends Vue {

}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.footer {
    footer {
        @include centered;
        height: 100%;
        font-size: $font-size-L;
        color: $default-light-color;
        .icon {
            width: 30px;
            height: 32px;
            margin-right: 9px;
            background-size: 30px 32px;
            @include bg-image("~assets/images/logo");
        }
    }
}
</style>
