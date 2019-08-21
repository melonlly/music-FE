<template>
    <div class="nav">
        <div class="tab">
            <router-link
                tag="div"
                linkActiveClass="active"
                @click.native="cutover(0)"
                to="/recommend"
            >
                <span>推荐</span>
            </router-link>
            <router-link tag="div" linkActiveClass="active" @click.native="cutover(1)" to="/singer">
                <span>歌手</span>
            </router-link>
            <router-link tag="div" linkActiveClass="active" @click.native="cutover(2)" to="/rank">
                <span>排行</span>
            </router-link>
            <router-link tag="div" linkActiveClass="active" @click.native="cutover(3)" to="/search">
                <span>搜索</span>
            </router-link>
            <div class="cursor" :style="{ left: index * 25 + '%' }"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
    components: {}
})
export default class Nav extends Vue {
    name: string = "Nav";
    index: number = 0; // 当前下标
    // 修改当前下标
    cutover(index: number): void {
        this.index = index;
    }
    created() {
		const path = this.$route.path
		if (path) {
            if (path.indexOf('recommend') > -1) {
                this.cutover(0)
            } else if (path.indexOf('singer') > -1) {
                this.cutover(1)
            } else if (path.indexOf('rank') > -1) {
                this.cutover(2)
            } else if (path.indexOf('search') > -1) {
                this.cutover(3)
            }
        }
	}
}
</script>

<style lang="scss" scoped>
.nav {
    .tab {
        position: relative;
        height: 100%;
        font-size: 0;
        div {
            display: inline-block;
            width: 25%;
            height: 100%;
            text-align: center;
            font-size: 16px;
            &.active {
                color: rgb(255, 207, 9);
            }
            span {
                position: relative;
                display: block;
                top: 50%;
                transform: translateY(-50%);
            }
        }
        .cursor {
            position: absolute;
            display: inline-block;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 25%;
            background: rgb(255, 207, 9);
            transition: left 0.2s;
        }
    }
}
</style>