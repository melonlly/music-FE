<template>
    <div class="rank">
        <scroller v-if="rankList.length" class="rank-wrapper" :dataList="rankList">
            <div
                class="item"
                v-for="(item, index) in rankList"
                :key="index"
                @click="selectRank(item)"
            >
                <div class="type">
                    <img v-lazy="item.picUrl" />
                    <listener :num="item.listenCount"></listener>
                </div>
                <div class="rank">
                    <h3 class="title">{{ item.topTitle }}</h3>
                    <p class="text" v-for="(song, i) in item.songList" :key="i">
                        {{ i + 1 }}
                        <span class="name">{{ song.songname }}</span>
                        - {{ song.singername }}
                    </p>
                    <i class="arrow"></i>
                </div>
            </div>
        </scroller>
        <!-- loading -->
        <loading v-show="!rankList.length"></loading>
        <!-- 榜单详情页 -->
        <transition name="slide">
            <router-view v-if="rank.id"></router-view>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter, Mutation } from "vuex-class";
import Listener from "@/components/Listener.vue";
import Scroller from "@/components/Scroller.vue";
import Loading from "@/components/Loading.vue";
import { goto } from '../utils/utils';

@Component({
    name: "Rank",
    components: {
        Listener,
        Scroller,
        Loading
    }
})
export default class Rank extends Vue {
    rankList: Array<any> = [];
    @Getter("getRank") rank!: any;
    @Mutation("SET_RANK") setRank!: (rank: any) => void;

	created() {
        const id = this.$route.params.id
        if (id) {
            this._getRankList().then(() => {
                let rank
                for (let i = 0; i < this.rankList.length; i++) {
                    if (id === this.rankList[i].id + '') {
                        rank = this.rankList[i]
                        break
                    }
                }
                this.selectRank(rank)
            })
        } else {
            this._getRankList()
        }
    }

    // 选择一个排行榜
    private selectRank(rank: any) {
        // 跳转排行榜详情页
        goto(this.$router, {
            path: `/rank/${rank.id}`
        })
        // 保存当前排行榜信息
        this.setRank(rank);
    }
    private _getRankList() {
        return this.$axios.get("/rank/list", {}).then(res => {
            if (res.status === this.$OK) {
                this.rankList = res.data;
            }
            return new Promise(resolve => {
                resolve();
            });
        });
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.rank {
    .rank-wrapper {
        overflow: hidden;
        .item {
            margin: 10px 15px;
            height: 120px;
            .type {
                position: relative;
                float: left;
                width: 120px;
                height: 120px;
                img {
                    width: 100%;
                    height: 100%;
                }
                .listener {
                    position: absolute;
                    left: 3%;
                    bottom: 0;
                    width: 100%;
                    height: 15%;
                }
            }
            .rank {
                position: relative;
                margin-left: 120px;
                height: 100px;
                padding: 10px 20px;
                background: rgb(51, 51, 51);
                .title {
                    margin-bottom: 5px;
                    font-size: $font-size-M;
                    font-weight: 400;
                    color: $default-light-color;
                }
                .text {
                    margin-bottom: 3px;
                    font-size: $font-size-S;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    .name {
                        color: $default-light-color;
                        margin: 0 5px 0 8px;
                    }
                }
                .arrow {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    margin-top: -5px;
                    @include arrow(6, 2, right);
                }
            }
        }
    }
    .slide-enter-active,
    .slide-leave-active {
        transition: all 0.3s;
    }
    .slide-enter,
    .slide-leave {
        transform: translate3d(100%, 0, 0);
    }
}
</style>
