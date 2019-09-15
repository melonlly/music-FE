<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
	name: 'Bus',
	components: {},
})
export default class Bus extends Vue {
	// toast的提示信息
	private toastMsg?: string
	// 显示 toast
	private toastShow: boolean = false

	private toast(msg: string, show: boolean) {
		this.toastMsg = msg
		this.toastShow = show
	}
	
}
</script>
