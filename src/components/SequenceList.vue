<template>
    <div class="sequence-list" v-show="isShowList">
        <scroller class="sequence-scroller" v-if="sequenceList.length > 0" :dataList="sequenceList">
            <ul>
                <li v-for="(song, index) in sequenceList" :key="index">
                    <span>{{ song.name }}</span>
                    <span> - {{ song.singer_name }}</span>
                </li>
            </ul>
        </scroller>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Scroller from "@/components/Scroller.vue"
import { Getter } from "vuex-class"

@Component({
	name: 'SequenceList',
	components: {
		Scroller
	},
})
export default class SequenceList extends Vue {
	@Getter("getIsShowList") isShowList!: boolean
	@Getter("getSequenceList") sequenceList!: Array<any>
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.sequence-list {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 70%;
    width: 100%;
    z-index: 300;
    background: $background-color;
    .sequence-scroller {
        overflow: hidden;
    }
}
</style>
