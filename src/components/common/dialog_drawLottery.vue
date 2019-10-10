<template>
    <van-dialog v-model="show" :title="title" class="dialog_drawLottery" :class="{'aaa ttt':animate}"
                :show-cancel-button="btn?btn[0]:false" :show-confirm-button="btn?btn[1]:false"
                :cancelButtonText="btn?btn[0]:''" :confirmButtonText="btn?btn[1]:''"
                @cancel="cancel()" @confirm="confirm()">
      <slot ></slot>
      <div slot="footer">123456</div>
    </van-dialog>
</template>

<script>
	import "@/assets/sass/lib/animate.css";
	import {Dialog} from 'vant';
	import Vue from 'vue'
	Vue.use(Dialog)

	export default {
		// model 是v-model 控制关闭和开启  title标题  onOk是点击确定的回调 btn是数组  告诉组件是否显示两个按钮的文案 第一个是取消 第二个是确认的 默认都不填写就不显示

    props: ['model','title','onOk','btn','animate'],
    model: {
			prop: 'model',
      event: 'change'
    },
		data() {
			return {
				show: false
      }
		},
		computed: {
    },
		watch: {
			model(v){
				this.show = v
      }
    },
		methods: {
			confirm(){
				this.onOk&&this.onOk()
				this.cancel()
      },
			cancel(){
				this.$emit('change', false)
      },


    },
		created() {
		},
		mounted() {
		},
	}
</script>

<style lang='scss' scoped>


  .dialog_drawLottery{
    top: 30% !important;
    left: calc(50% - 155px) !important;
    width: 310px !important;
    min-height: 256px;
    background: #FFFFFF;
    border-radius: 8px;
    /deep/.van-dialog__header {
      font-size: 18px;
      color: #333333;
    }
    /deep/ .van-dialog__content{
      padding: 20px 20px 30px;

    }
    /deep/ .close{
      position: absolute;
      right: 16px;
      top: 16px;
      width: 24px;
      height: 24px;
    }
  }


</style>
<style>
</style>
