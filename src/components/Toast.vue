<template>
	<div class="toast" @click="close" v-show="show">
		<div class="toast-info">
			<back @back="close"></back>
			<p>{{ msg }}</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Back from "@/components/Back.vue"

@Component({
	name: 'Toast',
	components: {
		Back
	},
})
export default class Toast extends Vue {
	@Prop({
        default: "melon six six six"
    })
	private readonly msg?: string
	@Prop({
        default: false
    })
	private readonly show?: boolean
	private close() {
		this.$bus.$emit("toast", "", false)
	}
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.toast {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 100%;
	width: 100%;
	background: rgba(255, 255, 255, .3);
	z-index: 9999;
	.toast-info {
		position: relative;
		top: 40%;
		width: 250px;
		// height: 125px;
		margin: auto;
		padding: 10px;
		background: $background-color;
		color: $default-light-color;
		text-align: center;
		border: 1px solid $default-light-color;
		border-radius: 20px;
		.back {
			width: 16px;
			height: 16px;
		}
		p {
			margin: 25px 0;
		}
	}
}
</style>
