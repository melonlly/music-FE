<template>
    <div class="recommend">
        <scroller ref="content" v-if="hots.length" :data="hots">
            <div class="recommend-slider">
                <slide v-if="recommends.length">
                    <div v-for="item in recommends" :key="item.id">
                        <a :href="item.linkUrl">
                            <img :src="item.picUrl" @load="loadImg" />
                        </a>
                    </div>
                </slide>
            </div>
            <article>
                <div class="title">热门歌单推荐</div>
                <div class="items" v-for="item in hots" :key="item.id">
                    <div class="item">
                        <div class="icon">
                            <img v-lazy="item.picUrl" />
                        </div>
                        <div class="desc">
                            <div class="name">{{ item.songListAuthor }}</div>
                            <div class="text">{{ item.songListDesc }}</div>
                            <listener :num="item.accessnum"></listener>
                        </div>
                    </div>
                </div>
            </article>
        </scroller>
        <!-- loading -->
        <loading v-show="!hots.length"></loading>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Scroller from "@/components/Scroller.vue";
import Slide from "@/components/Slide.vue";
import Loading from "@/components/Loading.vue";
import Listener from "@/components/Listener.vue";

@Component({
    components: {
        Scroller,
        Slide,
        Loading,
        Listener
    }
})
export default class Recommend extends Vue {
    name: string = "Recommend";
    recommends: Array<any> = []; // 推荐列表
    hots: Array<any> = []; // 热门列表
    imgIsDown: boolean = false; // 是否已经刷新滚动（图片加载完成后刷新）
    created() {
        this.getRecommend();
        this.getHots();
    }
    // 获取轮播图列表
    private getRecommend() {
        this.$axios.get("/recommend/nav", {}).then(res => {
            if (res.status === this.$OK) this.recommends = res.data;
        });
    }
    private getHots() {
        this.$axios.get("/hot/song/", {}).then(res => {
            if (res.status === this.$OK) this.hots = res.data;
        });
    }
    private loadImg() {
        if (!this.imgIsDown) {
            this.imgIsDown = true;
            (this.$refs.content as Scroller).refresh();
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
.recommend {
    overflow: hidden;
    .recommend-slider {
        position: relative;
        width: 100%;
        overflow: hidden;
    }
    article {
        position: relative;
        .title {
            height: 70px;
            line-height: 70px;
            text-align: center;
            font-size: $font-size-M;
            color: rgb(252, 204, 13);
        }
        .items {
            .item {
                position: relative;
                padding: 0 20px;
                margin-bottom: 15px;
                height: 70px;
                .desc {
                    margin-left: 80px;
                    padding: 5px 0;
                    font-size: $font-size-S;
                    div {
                        margin-bottom: 3px;
                    }
                    .name {
                        color: $default-color-M;
                    }
                    .listener {
                        position: absolute;
                        bottom: 0;
                        right: 20px;
                    }
                }
                .icon {
                    float: left;
                    width: 70px;
                    height: 70px;
                    img {
                        width: 100%;
                    }
                }
            }
        }
    }
}
</style>