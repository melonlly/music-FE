<template>
    <div id="app" @click.prevent="closeList">
        <m-header></m-header>
        <m-nav></m-nav>
        <keep-alive>
            <router-view class="app-content" :style="getContentH"></router-view>
        </keep-alive>
        <player></player>
        <transition name="login">
            <login v-show="showLogin"></login>
        </transition>
        <m-footer v-show="currentSong.id && !fullScreen"></m-footer>
        <m-svg></m-svg>
        <toast :msg="toastMsg" :show="toastShow"></toast>

        <transition>
            <sequence-list></sequence-list>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MHeader from "@/components/Header.vue";
import MFooter from "@/components/Footer.vue";
import MNav from "@/components/Nav.vue";
import Player from "@/components/Player.vue";
import MSvg from "@/components/Svg.vue";
import SequenceList from "@/components/SequenceList.vue";
import Toast from "@/components/Toast.vue";
import Login from "@/views/login.vue";
import { Getter, Mutation } from "vuex-class";
import { isContain } from "@/utils/dom"

@Component({
    name: "App",
    components: {
        MHeader,
        MFooter,
        MNav,
        Player,
        SequenceList,
        MSvg,
        Login,
        Toast
    }
})
export default class App extends Vue {
    @Getter("getIsShowList") isShowList!: boolean;
    @Getter("getCurrentSong") currentSong!: any;
    @Getter("getFullScreen") fullScreen!: boolean;
    @Getter("getShowLogin") showLogin!: boolean;
    @Mutation("SET_ISSHOWLIST") setIsShowList!: (isShowList: boolean) => void;

    private toastMsg: string = ""
    private toastShow: boolean = false

    created() {
        this.$bus.$on("toast", (msg: string, show: boolean) => {
            this.toastMsg = msg
            this.toastShow = show
        })
    }

    private get getContentH() {
        if (this.$route.name === "user-center") {
            return {
                height: "100%"
            }
        }
        if (this.currentSong.id && !this.fullScreen) {
            return {
                height: "74.5%"
            };
        } else {
            return {
                height: "84.5%"
            };
        }
    }

    // 关闭歌曲列表
    private closeList(e: any) {
        if (!this.isShowList) return false;
        const target = e.target;
        const className = target.className || "";
        const sequenceListDOM = document.querySelector(".sequence-list") as HTMLElement;
        if (
            className === "show-sequence-list" || isContain(sequenceListDOM, target)
        ) {
            this.setIsShowList(true);
        } else {
            this.setIsShowList(false);
        }
    }
}
</script>

<style lang="scss">
#app {
    height: 100%;
    .header {
        height: 8%;
    }
    .nav {
        height: 7.5%;
    }
    .app-content {
        height: 84.5%;
    }
    .footer {
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
