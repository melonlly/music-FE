<template>
    <div class="header">
        <header>
            <div class="icon"></div>
            <div class="title">Melon Music</div>
            <!-- <div class="login" @click="login" v-if="!getLogin"></div>
            <div class="user" v-if="getLogin"></div>-->
        </header>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
    name: 'Header',
    components: {},
})
export default class Header extends Vue {

}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.header {
    header {
        position: relative;
        @include centered;
        height: 100%;
        font-size: $font-size-L;
        color: $default-light-color;
        .icon {
            width: 64px;
            height: 32px;
            margin-right: 9px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            @include bg-image("~assets/images/logo");
        }
        // .login {
        //     position: absolute;
        //     right: 10px;
        //     width: 36px;
        //     height: 36px;
        //     background-size: cover;
        //     background-repeat: no-repeat;
        //     background-position: center;
        //     background-image: url("login.png");
        // }
        // .user {
        //     position: absolute;
        //     right: 10px;
        //     width: 36px;
        //     height: 36px;
        //     background-size: cover;
        //     background-repeat: no-repeat;
        //     background-position: center;
        //     background-image: url("user.png");
        // }
    }
}
</style>
