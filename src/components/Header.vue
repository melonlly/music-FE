<template>
    <div class="header">
        <header>
            <div class="icon"></div>
            <div class="title">Melon Music</div>
            <div class="sign" @click="setLogin(true)" v-if="!login"></div>
            <div class="user" v-if="login"></div>
        </header>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter, Mutation } from "vuex-class"

@Component({
    name: 'Header',
    components: {},
})
export default class Header extends Vue {
    @Getter("getLogin") login!: boolean
    @Mutation("SET_LOGIN") setLogin!: (login: boolean) => void
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
        .sign {
            position: absolute;
            right: 10px;
            width: 36px;
            height: 36px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            background-image: url("~assets/images/login.png");
        }
        .user {
            position: absolute;
            right: 10px;
            width: 36px;
            height: 36px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            background-image: url("~assets/images/user.png");
        }
    }
}
</style>
