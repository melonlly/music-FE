<template>
	<div class="item-bar">
		<i class="item-icon" v-if="imgUrl"></i>
		<div class="item-name">
			<div class="name"> {{ name }} </div>
			<div class="detail-wrapper">
				<!-- 属性项对应值，可为空 -->
				<div class="item-value">
					<slot></slot>
				</div>
				<i class="detail"></i>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
	name: 'ItemBar',
	components: {},
})
export default class ItemBar extends Vue {
	@Prop({
		default: ""
	})
	private readonly imgUrl?: string // icon的url
	@Prop({
		default: ""
	})
	private readonly name?: string // 属性项名称
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.item-bar {
	width: 100%;
	height: 49px;
	line-height: 48px;
	background: $background-color;
	color: $default-light-color;
	.item-icon {
		width: 30px;
		height: 30px;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.item-name {
		border-bottom: 1px solid $default-light-color;
		.name {
			display: inline-block;
		}
		.detail-wrapper {
			display: flex;
			float: right;
			.item-value {
				display: inline-block;
				opacity: .5;
			}
			.detail {
				width: 24px;
				height: 24px;
				margin-top: 12px;
				margin-left: 5px;
				background: url("~assets/images/arrow.png") no-repeat;
				background-size: cover;
			}
		}
	}
}
</style>
