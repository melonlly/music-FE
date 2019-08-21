<template>
    <div id="app">
        <m-header></m-header>
        <m-nav></m-nav>
        <keep-alive>
            <router-view class="app-content"></router-view>
        </keep-alive>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MHeader from '@/components/Header.vue';
import MNav from '@/components/Nav.vue';

@Component({
    components: {
        MHeader, MNav
    },
})
export default class App extends Vue {
    name: string = 'App'
}
</script>

<style lang="scss">
#app {
    height: 100%;
    .m-header {
        height: 8%;
    }
    .m-nav {
        height: 7.5%;
    }
    .app-content {
        height: 84.5%;
    }
    .m-footer {
        height: 10%;
    }

    .login {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 600;
    }
    .login-enter,
    .login-leave-to {
        transform: translate3d(0, 100%, 0);
    }
    .login-enter-active,
    .login-leave-active {
        transition: all 0.3s;
    }
}
</style>
