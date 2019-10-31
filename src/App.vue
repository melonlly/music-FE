<template>
    <div id="app" @click.prevent="closeList">
        <div class="container" style="width: 400px;height: 300px;background: #ffffff;"></div>
        <span v-for="(item, index) in Object.keys(test)" :key="index">
            {{ test[item] }}
        </span>

        <!-- <m-header></m-header>
        <m-nav></m-nav>
        <keep-alive>
            <router-view class="app-content" :style="getContentH"></router-view>
        </keep-alive>
        <player></player>
        <login v-show="showLogin"></login>
        <m-footer v-show="currentSong.id && !fullScreen"></m-footer>
        <m-svg></m-svg>
        <toast :msg="toastMsg" :show="toastShow"></toast>

        <transition name="list">
            <sequence-list></sequence-list>
        </transition>-->
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import MHeader from "@/components/Header.vue";
import MFooter from "@/components/Footer.vue";
import MNav from "@/components/Nav.vue";
import Player from "@/components/Player.vue";
import MSvg from "@/components/Svg.vue";
import SequenceList from "@/components/SequenceList.vue";
import Toast from "@/components/Toast.vue";
import Login from "@/views/login.vue";
import { Getter, Mutation } from "vuex-class";
import { isContain } from "@/utils/dom";

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

    private toastMsg: string = "";
    private toastShow: boolean = false;

    options: any = {
        xAxis: {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
            type: "value"
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: "line"
            }
        ]
    }
    test: any = {
        a: 1,
        b: '2',
        c: false
    }
    
    @Watch("options", { deep: true })
    onOptions() {
        this.$nRpsPty.chart.setOption(this.options, true);
    }

    created() {
        this.$bus.$on("toast", (msg: string, show: boolean) => {
            this.toastMsg = msg;
            this.toastShow = show;
        });
    }

    mounted() {
        const chart = this.$echarts.init(document.querySelector(".container") as HTMLDivElement)
        this.$nRpsPty.chart = chart
        this.$nRpsPty.chart.setOption(this.options, true);

        this.options.series[0].data.splice(6, 1, 111)
        // this.options.series[0].type = 'bar'

        // this.test.c = true
        this.test.d = 'hhhh'
    }

    private get getContentH() {
        if (this.$route.name === "user-center") {
            return {
                height: "100%"
            };
        }
        if (this.currentSong.songid && !this.fullScreen) {
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
        const sequenceListDOM = document.querySelector(
            ".sequence-list"
        ) as HTMLElement;
        if (
            className === "show-sequence-list" ||
            isContain(sequenceListDOM, target)
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

    .list-enter,
    .list-leave-to {
        transform: translate3d(0, 70%, 0);
    }
    .list-enter-active,
    .list-leave-active {
        transition: all 0.3s;
    }
}
</style>
