<template>
	<transition name="center">
		<div class="user-center">
			<div class="content-wrapper">
				<back @back="back"></back>
				<div class="header-wrapper">
					<img class="avatar" ref="avatar" src="~assets/images/tmp.jpg">
					<div class="user-name">
						{{ userinfo.name || 'super man' }}
					</div>
				</div>
				<item-bar :name="'动态'"></item-bar>
				<item-bar :name="'关注'"></item-bar>
				<item-bar :name="'粉丝'"></item-bar>
				<item-bar :name="'我的资料'"></item-bar>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ItemBar from '@/components/ItemBar.vue'
import Back from "@/components/Back.vue"
import { Getter } from 'vuex-class';

@Component({
	name: 'UserCenter',
	components: {
		ItemBar,
		Back
	},
})
export default class UserCenter extends Vue {
	@Getter("getUserInfo") userinfo!: any

	// 退出个人中心
	private back() {
		this.$router.back()
	}

	mounted() {
		if (this.userinfo.avatar) {
			(this.$refs.avatar as any).src = this.userinfo.avatar
		}
	}
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.user-center {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 400;
	background: $background-color;
	.content-wrapper {
		height: 100%;
		padding: 15px;
		.header-wrapper {
			@include centered();
			width: 100%;
			height: 160px;
			line-height: 160px;
			.avatar {
				width: 120px;
				height: 120px;
				margin-right: 20px;
				border-radius: 100%;
			}
			.user-name {
				color: $default-light-color;
				font-size: 18px;
			}
		}
	}
}
.center-enter,
.center-leave-to {
	transform: translate3d(100%, 0, 0);
}
.center-enter-active,
.center-leave-active {
	transition: all 0.3s;
}
</style>
