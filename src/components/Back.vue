<template>
	<div class="back" @click="back"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
	name: 'Back',
	components: {},
})
export default class Back extends Vue {
	// 退出
	private back() {
		this.$emit("back")
	}
}
</script>

<style lang="scss" scoped>
.back {
	position: absolute;
	top: 10px;
	left: 10px;
	z-index: 50;
	width: 24px;
	height: 24px;
	background-image: url("~assets/images/close.png");
	background-size: cover;
	transform: rotate(270deg);
}
</style>
