<template>
	<div class="profile" v-show="false">
		
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
	name: 'Profile',
	components: {},
})
export default class Profile extends Vue {

}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.profile {
	letter-spacing: 1px;
	
}
</style>
