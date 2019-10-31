import { Component, Vue } from "vue-property-decorator";
import { Getter, Mutation, Action } from "vuex-class"

@Component({
	name: 'PlayerMixin',
})
export default class PlayerMixin extends Vue {

	@Getter("getPlaying") playing!: boolean
	@Getter("getSinger") singer!: any
	@Getter("getFullScreen") fullScreen!: boolean
	@Getter("getMode") mode!: string
	@Getter("getSequenceList") sequenceList!: Array<any>
	@Getter("getCurrentIndex") currentIndex!: number
	@Getter("getCurrentSong") currentSong!: any

	@Mutation("SET_FULLSCREEN")
	setFullScreen!: (full: boolean) => void
	@Mutation("SET_PLAYING")
	setPlaying!: (playing: boolean) => void
	@Mutation("SET_CURRENTINDEX")
	setCurrentIndex!: (index: number) => void
	@Mutation("SET_MODE")
	setMode!: (mode: string) => void
	@Mutation("SET_ISSHOWLIST")
	setIsShowList!: (isShowList: boolean) => void

	// 上一首
	prev() {
		if (this.currentIndex === 0) {
			this.setCurrentIndex(this.sequenceList.length - 1)
		} else {
			this.setCurrentIndex(this.currentIndex - 1)
		}
	}
	// 下一首
	next() {
		if (this.currentIndex === this.sequenceList.length - 1) {
			this.setCurrentIndex(0)
		} else {
			this.setCurrentIndex(this.currentIndex + 1)
		}
	}

}
