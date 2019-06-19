<template>
    <div class="showImg">
        <button @click="choose">选择图片</button>
        <img src="value" alt="">
        <div class="test">
            <input type="text" placeholder="输入图片地址">
            <button>提交</button>
            <ul v-if="List.length">
                <li v-for="item in List" :key="item"><img :src="item" alt=""></li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
	name: "imagePath",
	data() {
		return {
			value: "",
			List: []
		};
	},
	methods: {
		choose(path) {
			console.log("显示图片");

			/*约定的key*/
			var androidImgKey = "http://androidimg";

			this.value = androidImgKey + path;
		}
	}
};
</script>

<style lang="scss">
button {
	border: 1px solid #ccc;
}
</style>
