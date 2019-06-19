<template>
    <div class="test">
        <h1 >123456</h1>
        <!--<iframe src="hsinaif://dailogView?msg=您确定要一次性还清吗？&title=温馨提示&leftBtn=取消&rightBtn=确认&isBackCancel=false&callbackName=complete"-->
                <!--frameborder="0"></iframe>-->
        <iframe :src="url" frameborder="0"></iframe>
    </div>
</template>

<script>
    import axios from "axios"; // 使用 axios 做请求
	export default {
		data() {
			return {
			    url: 'hsinaif://livingBodyCheck?callbackName=complete'
            }
		},
		computed: {},
		watch: {},
		methods: {
            test(){
                this.url = 'hsinaif://loadingView?close=true&type=1'
            }
        },
		created() {
		    window.complete = function(res){
                console.log(res.data)
            }
		},
		mounted() {

		},
	}
</script>

<style lang='scss' scoped>

</style>
