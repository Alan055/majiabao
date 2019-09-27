<template>
  <scroller :head="head">
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1>框架开发</h1>
    <h1 @click.native="$root.closeWindow()">框架开发</h1>
  </scroller>
</template>

<script>
	import scroller from "@/components/view/view.vue";
	export default {
		components: {scroller},
		data() {
			return {
				head: {
					left: 'back',
          title: '我的积分',
          right: [
	          {img: '/static/images/close.png', needLogin: true, jumpUrl: 'http://www.baidu.com'},
	          {img: '/static/icon/my/help/ap_at@2x.png', needLogin: false, jumpUrl: 'http://www.baidu.com'},
          ],
					border: true,
        }
      }
		},
		computed: {},
		watch: {},
		methods: {},
		created() {
			this.$root.setWebAttribute({isFull: true,isTrans: true});// 隐藏原生的状态栏
		},
		mounted() {
		},
	}
</script>

<style lang='scss' scoped>

</style>
